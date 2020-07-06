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
    currentStep:0, 
    verifiedSteps:0, 
    page:1,
    stepStatus:"",
    previousButtonName:"Previous",
    nextButtonName:"Next",
    details:{
      senderName:{
        name:"senderName",
        value:'',
        isRequired:true,
        accepted:true
      },
      senderMobile:{
        name:"senderMobile",
        value:null,
        isRequired:false,
        accepted:false
      },
      senderEmail:{
        name:"senderEmail",
        value:null,
        isRequired:false,
        accepted:true,
        hasError:false
      },
      recieverName:{
        name:"recieverName",
        value:null,
        isRequired:true,
        accepted:true
      },
      recieverMobile:{
        name:"recieverMobile",
        value:null,
        isRequired:false,
        accepted:true
      },
      recieverEmail:{
        name:"recieverEmail",
        value:null,
        isRequired:false,
        accepted:true,
        hasError:false
      },
      destination:{
        name:"destination",
        value:null,
        isRequired:false,
        accepted:true,
        options:[{
          value:0,
          name:"value0"
        },
        {
          value:1,
          name:"value1"
        }]
      },
      description:{
        name:"description",
        value:'',
        isRequired:true,
        accepted:true
      },
      declaredValue:{
        name:"declaredValue",
        value:null,
        isRequired:true,
        accepted:true
      },
      quantity:{
        name:"quantity",
        value:null,
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
        value:null,
        isRequired:false,
        accepted:true
      },
      packageInsurance:{
        name:"packageInsurance",
        value:null,
        isRequired:false,
        accepted:true
      },
      type:{
        name:"type",
        value:2,
        isRequired:false,
        accepted:true,
        options:[
        {
          value:0,
          name:"Excess AC"
        },
        {
          value:1,
          name:"Excess Non AC"
        },
        {
          value:2,
          name:"Cargo Padala"
        }
        ]
      },
      packageWeight:{
        name:"packageWeight",
        value:null,
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
        value:null,
        isRequired:false,
        accepted:true
      },
      paxs:{
        name:"paxs",
        value:null,
        isRequired:true,
        accepted:true
      },
    }
  })

  let createRef = React.useRef(null);
  
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

  const ParcelDetailsFormOnChange = (name, value) =>{
    let item = null;
    let details = null;

    if(name === 'senderEmail' || name === 'recieverEmail'){
      item = {...state.details[name], ...{value, hasError:false}}
      details = {...state.details, ...{[name]:item}}
    }else{
      item = {...state.details[name], ...{value, accepted:true}}
      details = {...state.details, ...{[name]:item}}
    }
    setState({...state, ...{details}});
  }

  const onBlurValidation = (name)=>{  

    let item;
    let details;

    if(state.details[name].isRequired && 
        (state.details[name].value === "" || 
          state.details[name].value === null) ){

      item = {...state.details[name], ...{ 
        isRequired:true, 
        accepted:false, 
      }}
      details = {...state.details, ...{[name]:item}}
      setState({...state, ...{details}});

      return;
    }


    if(name === 'senderEmail' || name === 'recieverEmail'){
      const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.details[name].value)
      if(!validEmail){
        item = {...state.details[name], ...{ 
          hasError:true,
          isRequired:true,
          errorMessage:"Invalid name!" 
         }}
        details = {...state.details, ...{[name]:item}}
        setState({...state, ...{details}});
      }
      return;
    }

    console.log('onBlurValidation',name)

    if(name === 'senderMobile' || name === 'recieverMobile' ){
      const validNumber = /^\d+$/.test(state.details[name].value);
      console.log('validNumber=====>>',validNumber )
      if(!validNumber || (state.details[name].value.length !== 10)){
        item = {...state.details[name], ...{
          isRequired:true, 
          accepted:false, 
          errorMessage:"Invalid phone number!" 
        }}
        details = {...state.details, ...{[name]:item}}
        setState({...state, ...{details}});
      }
      return;
    }

    if(name === 'senderName' || name === 'recieverName' ){
      const validString = /^[A-Za-z]+$/.test(state.details[name].value);
      console.log('validNumber=====>>',validString )
      if(!validString){
        item = {...state.details[name], ...{
          isRequired:true, 
          accepted:false, 
          errorMessage:"Invalid name!" 
        }}
        details = {...state.details, ...{[name]:item}}
        setState({...state, ...{details}});
      }
      return;
    }


  }

  const onSelectChange = (value)=>{
    const destination = {...state.details.destination, ...{value}}
    const details = {...state.details, ...{destination}}
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
            <ScheduledTrips onSelect={(trip)=>{onSelectTrip(trip)}}/>
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
        if(isRequired && (value === null || value === '')){
          hasError = true;
          console.log('validateStep',e)
        }
      })
      if(hasError){
        openNotificationWithIcon({title:"Parcel Details Validation", type:'error', message:"Please fill up required fields"})
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