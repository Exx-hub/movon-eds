import React, { useState } from 'react';
import './create.scss';
import ParcelDetailsForm from '../../component/forms/createParcelForm'
import StepsView from '../../component/steps'
import WebCam from '../../component/webcam'
import ScheduledTrips from '../../component/scheduledTrips'
import ReviewDetails from '../../component/reviewDetails'
import TicketView from '../../component/ticketView'
import {useWindowSize} from '../../utility'
import {Button, PageHeader, Row, Col, message, notification, Layout, Divider } from 'antd';
import ReactToPrint from 'react-to-print'; 
import { ArrowLeftOutlined } from '@ant-design/icons';
import ParcelService from '../../service/Parcel'
import {getUser} from '../../utility'

const{ Content, Sider, Header }=Layout;

const MIN_WIDTH = 800;

const STEPS_LIST=[
  {
    title:"Parcel Details", 
    description:"Fill up parcel information"
  },
  {
    title:"Parcel Image", 
    description:"Take image of the parcel"
  },
  {
    title:"Select Trip", 
    description:"Choose from available trips"
  },
  {
    title:"Preview Parcel", 
    description:"Finalize your data"
  },
  {
    title:"Print", 
    description:"Print QR stickers"
  }
]

function CreateParcel(props){
  let printEl = React.useRef(null);
  const size = useWindowSize();

  const [state,setState] = useState({
    packageImagePreview:null,
    currentStep:2, 
    verifiedSteps:2, 
    page:1,
    stepStatus:"",
    previousButtonName:"Previous",
    nextButtonName:"Next",
    details:{
      senderName:{
        name:"senderName",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      senderMobile:{
        name:"senderMobile",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      senderEmail:{
        name:"senderEmail",
        value:undefined,
        isRequired:false,
        accepted:true,
        hasError:false
      },
      recieverName:{
        name:"recieverName",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      recieverMobile:{
        name:"recieverMobile",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      recieverEmail:{
        name:"recieverEmail",
        value:undefined,
        isRequired:false,
        accepted:true,
        hasError:false
      },
      destination:{
        name:"destination",
        value:undefined,
        isRequired:true,
        accepted:true,
        options:[]
      },
      description:{
        name:"description",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      declaredValue:{
        name:"declaredValue",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      quantity:{
        name:"quantity",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      systemFee:{
        name:"systemFee",
        value:0,
        isRequired:false,
        accepted:true
      },
      additionNote:{
        name:"additionNote",
        value:undefined,
        isRequired:false,
        accepted:true
      },
      packageInsurance:{
        name:"packageInsurance",
        value:undefined,
        isRequired:false,
        accepted:true
      },
      type:{
        name:"type",
        value:3,
        isRequired:false,
        accepted:true,
        options:[
        {
          value:1,
          name:"Excess AC"
        },
        {
          value:2,
          name:"Excess Non AC"
        },
        {
          value:3,
          name:"Cargo Padala"
        }
        ]
      },
      packageWeight:{
        name:"packageWeight",
        value:undefined,
        isRequired:true,
        accepted:true
      },
      shippingCost:{
        name:"shippingCost",
        value:0,
        isRequired:false,
        accepted:true
      },
      totalShippingCost:{
        name:"totalShippingCost",
        value:0,
        isRequired:false,
        accepted:true
      },
      paxs:{
        name:"paxs",
        value:undefined,
        isRequired:false,
        accepted:true,
        disabled:false 
      },
    },
    trips:null,
  })

  const oldPropsRef = React.useRef();

  React.useEffect(()=>{

    if(!oldPropsRef.current){
      oldPropsRef.current = state;
    }

    if(state.trips == null){
      const stationId = getUser().assignedStation._id;
      ParcelService.getTrips(stationId).
      then(e=>{
        console.log('getTrips====>>',e)
        const{data, success}=e.data;
        if(success){
          if(data.trips){
            const options = [];
            const map = new Map();
    
            for (const station of data.trips.data) {
                if (!map.has(station.endStation._id)) {
                    map.set(station.endStation._id, true);
                    options.push({
                        value: station.endStation._id,
                        name: station.endStation.name,
                        data: station
                    })
                }
            }
            const item = {...state.details.destination,...{options}}
            const details = {...state.details, ...{destination:item}}
            oldPropsRef.current = {...state,...{trips:data.trips.data, details}}
            setState({...state,...{trips:data.trips.data, details}})
          }
        }
      })
    }

    let details = state.details;

    if(oldPropsRef.current && oldPropsRef.current.details){
      const{ destination, packageWeight, declaredValue, paxs }= oldPropsRef.current.details
      if(details.destination.value !== destination.value 
          || details.packageWeight.value !== packageWeight.value 
            || details.declaredValue.value !== declaredValue.value){

              if(details.destination.value 
                  && details.packageWeight.value 
                    && details.declaredValue.value){

                      if(details.type.value !== 3 && details.paxs.value === paxs.value){
                        return;
                      }

                      computePrice();
                    }
            }
    }

    const total = parseFloat(details.systemFee.value || 0) + parseFloat(details.shippingCost.value) ;
    const totalShippingCost = details.totalShippingCost.value || 0;
    if(parseFloat(total).toFixed(2) !== totalShippingCost){
      const totalShippingCost = {...details.totalShippingCost,...{value:parseFloat(total).toFixed(2)}}
      const _details = {...details, ...{totalShippingCost}}
      setState({...state,...{details:_details}})
    }

    console.log('useEffect====>')
  },[state.details]);

  const getConvinienceFee = async(qty)=>{
    const res = await ParcelService.getConvenienceFee(qty);
    const{success, data}=res.data
    if(success){
      return data.convenienceFee
    }
    return 0;
  }

  const computePrice = () =>{

    const isNull = (value)=>(value === null || value === undefined || value === ''); 
    const{ destination, declaredValue, paxs, packageWeight, type }=state.details
    const busCompanyId = getUser().busCompanyId;
    const startStation = getUser().assignedStation._id;
    const endStationOption = destination.options.filter(e=>e.value == destination.value)[0]
    const endStation = endStationOption ? endStationOption.data.endStation._id : undefined;
    const decValue =  declaredValue.value ? parseFloat(declaredValue.value).toFixed(2) : undefined;
    const pax = paxs.value || 0;
    const weight = packageWeight.value ? parseFloat(packageWeight.value).toFixed(2) : undefined
    
    if(!isNull(busCompanyId) && !isNull(startStation) && !isNull(endStation) && !isNull(weight)){
      ParcelService.getDynamicPrice(
        busCompanyId, 
        decValue, 
        endStation, 
        type.value,
        pax, 
        startStation, 
        weight
      ).then(e => {
        const{ data, success }=e.data;  
        if(success){
          const shippingCost = {...state.details.shippingCost, ...{value:data.totalCost}}
          const details = {...state.details, ...{shippingCost}}
          oldPropsRef.current = {...state, ...{details}}
          setState({...state, ...{details}})
        }
        
      })
    }
  }

  const onSuccessMsg = (msg) => {
    message.success( msg || 'This is a success message' );
  };
  
  const onErrorMsg = (msg) => {
    message.error( msg || 'This is an error message' );
  };

  const onCaptureImage = (bs64) =>{
    setState({...state,...{packageImagePreview:bs64}})
  }

  const onCreateNewParcel = () =>{
    //create new parcel
    console.log('onCreateNewParcel')
    setState({currentStep:0, validateStep:0})
  }

  const onSelectTrip = trip =>{
    validateStep()
  }

  const openNotificationWithIcon = props => {
    notification[props.type]({
      message: props.title || 'Notification Title',
      description: props.message || 'message',
    });
  };

  const StepControllerView = (props) =>{
    return (<div className={[`step-controller-container-item ${ size.width < 500 ? "button-steps" : ""}` ]}>
    { 
      !props.disablePreviousButton && 
      <Button className="create-btn btn-prev" onClick={()=>{props.onPreviousStep ? props.onPreviousStep() : onPreviousStep()}}>{props.previousButtonName || "Previous"}</Button>
    }
    { 
      !props.disableNextButton && 
      <Button className="create-btn btn-next" onClick={()=>{ props.onNextStep ? props.onNextStep() : validateStep()}}>{props.nextButtonName || "Next"}</Button>
    }
  </div>)
  }

  const ParcelDetailsFormOnChange = async(name, value) =>{
    let item = null;
    let details = state.details;

    if(name === 'senderEmail' || name === 'recieverEmail'){
      item = {...details[name], ...{value, hasError:false}}
      details = {...details, ...{[name]:item}}

    }else{
      item = {...details[name], ...{value, accepted:true}}
      details = {...details, ...{[name]:item}}

      if(name == 'quantity' && value){
        const fee = await getConvinienceFee(value);
        const systemFee = {...details.systemFee,...{value:fee}}
        details = {...details, ...{systemFee}}
      }
    }
    setState({...state, ...{details}});
  }

  const onBlurValidation = (name)=>{  

    let item;
    let details = state.details;

    if(name === 'senderEmail' || name === 'recieverEmail'){
      const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details[name].value)
      if(!validEmail){
        item = {...details[name], ...{ 
          hasError:true,
          isRequired:true,
          errorMessage:"Invalid name!" 
         }}
        details = {...details, ...{[name]:item}}
      }
    }

    if(name === 'senderMobile' || name === 'recieverMobile' ){
      const validNumber = /^\d+$/.test(details[name].value);
      if(!validNumber || !(details[name].value.length === 10)){
        item = {...details[name], ...{
          isRequired:true, 
          accepted:false, 
          errorMessage:"Invalid phone number!" 
        }}
        details = {...details, ...{[name]:item}}
      }
    }

    if(name === 'senderName' || name === 'recieverName' ){
      const validString = /^[A-Za-z]+$/.test(details[name].value);
      if(!validString){
        item = {...details[name], ...{
          isRequired:true, 
          accepted:false, 
          errorMessage:"Invalid name!" 
        }}
        details = {...details, ...{[name]:item}}
      }
    }

    if(details[name].isRequired && 
      (details[name].value === "" || 
        details[name].value === null ||
          details[name].value === undefined) 
    ){
      item = {...details[name], ...{ isRequired:true, accepted:false }}
      details = {...details, ...{[name]:item}}
    }
    setState({...state, ...{details}});
  }

  const onSelectChange = (value)=>{
    const destination = {...state.details.destination, ...{value}}
    const details = {...state.details, ...{destination}}
    setState({...state, ...{details}});
  }
  
  const onTypeChange = (e)=>{
    const value = e.target.value;
    let details = state.details;
    const type = {...details.type, ...{value}}
    const paxs = {...details.paxs, ...{isRequired: value !== 3, disabled:value === 3 }}
    details = {...details, ...{type,paxs}}
    setState({...state, ...{details}});
  }

  const stepSelection = (step) =>{

    let view = null;
    
    switch (step) {
      case 0:
        view = <>
            <ParcelDetailsForm 
              onBlur={(name)=>onBlurValidation(name)}
              details={state.details} 
              onTypeChange={(e)=>onTypeChange(e)}
              onSelectChange={(value)=>onSelectChange(value)}
              onChange={(e)=>ParcelDetailsFormOnChange(e.target.name, e.target.value)} />
            <StepControllerView />
            </>
        break;
      case 1:
        view = <>
            <WebCam image = {state.packageImagePreview} onCapture={onCaptureImage}/>
            <StepControllerView />
          </>
        break;
      case 2:
        view = <>
            <ScheduledTrips windowSize={size} onSelect={(trip)=>{onSelectTrip(trip)}}/>
            <StepControllerView disableNextButton={true}/>
          </>
        break;
      case 3:
        view = <>
            <ReviewDetails />
            <StepControllerView 
              nextButtonName = "Create Parcel" 
              enablePreviousButton={true} 
              onNextStep={()=>{
                console.log('need to call api then pass it to state')
                validateStep();
              }}
            />
          </>
        break;
      case 4:
        view = <>
            <div ref={el => (printEl = el)}><TicketView /></div>
            <div className="on-step4-button-group">
              <ReactToPrint 
                content={() => printEl} 
                trigger={() => { return <Button>Print Parcel</Button> }}/>
              <Button className="btn-create-new-parcel" onClick={onCreateNewParcel}>Create New Parcel</Button>
            </div>
          </>
        break;
    
      default:
        break;
    }
    return(<div className="content-section">{ view }</div>)
  }

  const validateStep = () =>{
    if(state.verifiedSteps >= 4){
      console.log('already created.. no more modification')
      return;
    }

    if(state.currentStep === 0){
      let hasError = false;
      Object.keys(state.details).map(e=>{
        let value = state.details[e].value;
        let isRequired = state.details[e].isRequired;
        if(isRequired && (value === null || value === '' || value === undefined)){
          hasError = true;
        }
      })
      if(hasError){
        openNotificationWithIcon({title:"Parcel Details Validation", type:'error', message:"Please fill up required fields"})
        let details= state.details;
        Object.keys(state.details).map(e=>{
          let value = state.details[e].value;
          let isRequired = state.details[e].isRequired;
          
          if(isRequired && (value === null || value === '' || value === undefined)){
            let item = {...details[e], ...{accepted:false} }
            details = {...details, ...{[e]:item}}
          }
        });
        setState({...state,...{details}})
        return;
      }
    }

    if(state.currentStep === 1){
      if(!state.packageImagePreview || state.packageImagePreview === ''){
        openNotificationWithIcon({title:"Parcel Image Validation", type:'error', message:"Please take photo and continue"})
        return;
      }
    }

    let verifiedSteps = state.currentStep
    if(state.currentStep + 1 > verifiedSteps){
       verifiedSteps = verifiedSteps + 1;
    }
    const currentStep = state.currentStep + 1;
    setState({...state,...{currentStep,verifiedSteps}})
  }

  const onPreviousStep = () =>{
    if(state.currentStep > 0 && state.verifiedSteps < 4){
      const currentStep = state.currentStep - 1;
      setState({...state,...{currentStep}})
    }
  }

  const onChangeSteps = (step) =>{
    if(state.verifiedSteps >= step){
      setState({...state,...{currentStep:step}})
    }
  }

  return (
    <Layout className="create-parcelview-parent-container">
     
      <Header className="home-header-view" style={{padding:0}}>
        <div style={{ float: 'left' }}>
          <Button type="link" onClick={() => props.history.goBack()}>
            <ArrowLeftOutlined style={{ fontSize: '20px', color: '#fff' }} />
            <span style={{ fontSize: '20px', color: '#fff' }}>Home</span>
          </Button>
        </div>
      </Header>

      <Layout>
        {
          size.width > MIN_WIDTH &&
          <Sider width={200} className="create-side-bar">
            <div style={{marginLeft:'1rem', marginTop:'1rem'}}>
              <StepsView
                stepList={STEPS_LIST} 
                current={state.currentStep}
                onchange={(s)=>onChangeSteps(s)}                    
                direction="vertical"/>
            </div>
          </Sider>
        }
        <Content>
          <div className="create-content-container">
            <div className={`horizontal-step ${size.width > MIN_WIDTH ? 'hide' : ""}`}>
              <StepsView 
                stepList={STEPS_LIST} 
                current={state.currentStep}
                onchange={(s)=>onChangeSteps(s)}
                progressDot={true} 
                direction="horizontal" /> 
            </div>
            { stepSelection(state.currentStep) }
          </div>
        </Content>
      </Layout>

    </Layout>
  );
}

export default CreateParcel;