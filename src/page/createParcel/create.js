import React from "react";
import "./create.scss";
import ParcelDetailsForm from "../../component/forms/createParcelForm";
import StepsView from "../../component/steps";
import WebCam from "../../component/webcam";
import ScheduledTrips from "../../component/scheduledTrips";
import ReviewDetails from "../../component/reviewDetails";
import TicketView from "../../component/ticketView";
import { useWindowSize } from "../../utility";
import {
  Button,
  PageHeader,
  Row,
  Col,
  message,
  notification,
  Layout,
  Divider,
} from "antd";
import ReactToPrint from "react-to-print";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ParcelService from "../../service/Parcel";
import {
  getUser,
  openNotificationWithIcon,
  clearCredential,
  debounce,
} from "../../utility";
import{errorDetails}from '../../config'

const { Content, Sider, Header } = Layout;

const MIN_WIDTH = 800;

const STEPS_LIST = [
  {
    title: "Parcel Details",
    description: "Fill up parcel information",
  },
  {
    title: "Parcel Image",
    description: "Take image of the parcel",
  },
  {
    title: "Select Trip",
    description: "Choose from available trips",
  },
  {
    title: "Preview Parcel",
    description: "Finalize your data",
  },
  {
    title: "Print",
    description: "Print QR stickers",
  },
];

const isNull = (value) => value === null || value === undefined || value === "";

// function xCreateParcel(props){
//   let printEl = React.useRef(null);
//   const size = useWindowSize();

//   const [state,setState] = useState({
//     packageImagePreview:null,
//     currentStep:0,
//     verifiedSteps:0,
//     page:1,
//     stepStatus:"",
//     previousButtonName:"Previous",
//     nextButtonName:"Next",
//     details:{
//       billOfLading:{
//         name:"billOfLading",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       senderName:{
//         name:"senderName",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       senderMobile:{
//         name:"senderMobile",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       senderEmail:{
//         name:"senderEmail",
//         value:undefined,
//         isRequired:false,
//         accepted:true,
//         hasError:false
//       },
//       recieverName:{
//         name:"recieverName",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       recieverMobile:{
//         name:"recieverMobile",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       recieverEmail:{
//         name:"recieverEmail",
//         value:undefined,
//         isRequired:false,
//         accepted:true,
//         hasError:false
//       },
//       destination:{
//         name:"destination",
//         value:undefined,
//         isRequired:true,
//         accepted:true,
//         options:[]
//       },
//       description:{
//         name:"description",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       declaredValue:{
//         name:"declaredValue",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       quantity:{
//         name:"quantity",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       systemFee:{
//         name:"systemFee",
//         value:0,
//         isRequired:false,
//         accepted:true
//       },
//       additionNote:{
//         name:"additionNote",
//         value:undefined,
//         isRequired:false,
//         accepted:true
//       },
//       packageInsurance:{
//         name:"packageInsurance",
//         value:undefined,
//         isRequired:false,
//         accepted:true
//       },
//       type:{
//         name:"type",
//         value:3,
//         isRequired:false,
//         accepted:true,
//         options:[
//         {
//           value:1,
//           name:"Excess AC"
//         },
//         {
//           value:2,
//           name:"Excess Non AC"
//         },
//         {
//           value:3,
//           name:"Cargo Padala"
//         }
//         ]
//       },
//       packageWeight:{
//         name:"packageWeight",
//         value:undefined,
//         isRequired:true,
//         accepted:true
//       },
//       shippingCost:{
//         name:"shippingCost",
//         value:0,
//         isRequired:false,
//         accepted:true
//       },
//       totalShippingCost:{
//         name:"totalShippingCost",
//         value:0,
//         isRequired:false,
//         accepted:true
//       },
//       paxs:{
//         name:"paxs",
//         value:undefined,
//         isRequired:false,
//         accepted:true,
//         disabled:false
//       },
//     },
//     trips:undefined,
//     selectedTrip:undefined,
//     checkIn:false,
//     isLoading:false,
//     createParcelResponseData:undefined
//   })

//   const oldPropsRef = React.useRef();

//   React.useEffect(()=>{
//     if(state.trips === undefined){
//       const stationId = getUser().assignedStation._id;
//       ParcelService.getTrips(stationId).then(e=>{
//         console.log('getTrips====>>',e)
//         const{data, success, errorCode}=e.data;
//         if(success){
//           if(data.trips){
//             const options = [];
//             const map = new Map();

//             for (const station of data.trips.data) {
//                 if (!map.has(station.endStation._id)) {
//                     map.set(station.endStation._id, true);
//                     options.push({
//                         value: station.endStation._id,
//                         name: station.endStation.name,
//                         data: station
//                     })
//                 }
//             }
//             const item = {...state.details.destination,...{options}}
//             const details = {...state.details, ...{destination:item}}
//             oldPropsRef.current = {...state,...{trips:data.trips.data, details}}
//             setState({...state,...{trips:data.trips.data, details}})
//           }
//         }else{
//           openNotificationWithIcon('error', errorCode, ()=>{
//             clearCredential();
//             props.history.push('/')
//           })
//         }
//       })
//     }

//     let details = state.details;

//     if(oldPropsRef.current && oldPropsRef.current.details){
//       const{ destination, packageWeight, declaredValue, paxs }= oldPropsRef.current.details
//       if(details.destination.value !== destination.value
//           || details.packageWeight.value !== packageWeight.value
//             || details.declaredValue.value !== declaredValue.value){

//               if(details.destination.value
//                   && details.packageWeight.value
//                     && details.declaredValue.value){

//                       if(details.type.value !== 3 && details.paxs.value === paxs.value){
//                         return;
//                       }

//                       computePrice();
//                     }
//             }
//     }

//     const total = parseFloat(details.packageInsurance.value || 0) + parseFloat(details.systemFee.value || 0) + parseFloat(details.shippingCost.value) ;
//     const totalShippingCost = parseFloat(details.totalShippingCost.value || 0).toFixed(2) ;
//     if(parseFloat(total).toFixed(2) !== totalShippingCost){
//       const totalShippingCost = {...details.totalShippingCost,...{value:parseFloat(total).toFixed(2)}}
//       const _details = {...details, ...{totalShippingCost}}
//       setState({...state,...{details:_details}})
//     }

//     if(oldPropsRef.current && oldPropsRef.current.selectedTrip !== state.selectedTrip){
//       validateStep()
//     }
//     oldPropsRef.current = state;
//     console.log('useEffect====>old', oldPropsRef.current)
//   },[state]);

//   async function getConvinienceFee(qty) {
//     const res = await ParcelService.getConvenienceFee(qty);
//     const { success, data } = res.data;
//     if (success) {
//       return data.convenienceFee;
//     }
//     return 0;
//   }

//   const computePrice = () =>{

//     const{ destination, declaredValue, paxs, packageWeight, type }=state.details
//     const busCompanyId = getUser().busCompanyId;
//     const startStation = getUser().assignedStation._id;
//     const endStationOption = destination.options.filter(e=>e.value == destination.value)[0]
//     const endStation = endStationOption ? endStationOption.data.endStation._id : undefined;
//     const decValue =  declaredValue.value ? parseFloat(declaredValue.value).toFixed(2) : undefined;
//     const pax = paxs.value || 0;
//     const weight = packageWeight.value ? parseFloat(packageWeight.value).toFixed(2) : undefined

//     if(!isNull(busCompanyId) && !isNull(startStation) && !isNull(endStation) && !isNull(weight)){
//       ParcelService.getDynamicPrice(
//         busCompanyId,
//         decValue,
//         endStation,
//         type.value,
//         pax,
//         startStation,
//         weight
//       )
//       .then(e => {
//         console.log(' ====>>e',e)
//         const{ data, success }=e.data;
//         if(success){
//           const value = parseFloat(data.totalCost).toFixed(2)
//           const shippingCost = {...state.details.shippingCost, ...{value}}
//           const details = {...state.details, ...{shippingCost}}
//           setState({...state, ...{details}})
//         }
//       })
//     }
//   }

//   const onSuccessMsg = (msg) => {
//     message.success( msg || 'This is a success message' );
//   };

//   const onErrorMsg = (msg) => {
//     message.error( msg || 'This is an error message' );
//   };

//   const onCaptureImage = (bs64) =>{
//     setState({...state,...{packageImagePreview:bs64}})
//   }

//   const onCreateNewParcel = () =>{
//     //create new parcel
//     console.log('onCreateNewParcel')
//     setState({currentStep:0, validateStep:0})
//   }

//   const onSelectTrip = selectedTrip =>{
//     setState({...state,...{selectedTrip}})
//   }

//   const showNotification = props => {
//     notification[props.type]({
//       message: props.title || 'Notification Title',
//       description: props.message || 'message',
//     });
//   };

//   const StepControllerView = (props) =>{
//     return (<div className={[`step-controller-container-item ${ size.width < 500 ? "button-steps" : ""}` ]}>
//     {
//       !props.disablePreviousButton &&
//       <Button className="create-btn btn-prev" onClick={()=>{props.onPreviousStep ? props.onPreviousStep() : onPreviousStep()}}>{props.previousButtonName || "Previous"}</Button>
//     }
//     {
//       !props.disableNextButton &&
//       <Button
//         disabled={props.disabled}
//         className={`${props.disabled ? 'create-btn disabled-btn' :"create-btn btn-next"}`}
//         onClick={()=>{ props.onNextStep ? props.onNextStep() : validateStep()}}>{props.nextButtonName || "Next"}</Button>
//     }
//   </div>)
//   }

//   const ParcelDetailsFormOnChange = async(name, value) =>{
//     let item = null;
//     let details = state.details;

//     if(name === 'senderEmail' || name === 'recieverEmail'){
//       item = {...details[name], ...{value, hasError:false}}
//       details = {...details, ...{[name]:item}}

//     }else{
//       item = {...details[name], ...{value, accepted:!isNull(value)}}
//       details = {...details, ...{[name]:item}}

//       if(name === 'quantity' && value){
//         const fee = await getConvinienceFee(value);
//         const systemFee = {...details.systemFee,...{value:fee}}
//         details = {...details, ...{systemFee}}
//       }

//       if(name === 'declaredValue'){
//         const fee = parseFloat(value * 0.1).toFixed(2)
//         const packageInsurance = {...details.packageInsurance,...{value:fee}}
//         details = {...details, ...{packageInsurance}}
//       }

//       if(name === 'billOfLading'){
//         const billOfLading = {...details.billOfLading,...{value, accepted:!isNull(value)}}
//         details = {...details, ...{billOfLading}}
//       }
//     }

//     setState({...state, ...{details}});
//   }

//   const onBlurValidation = (name)=>{

//     let item;
//     let details = state.details;

//     if(name === 'senderEmail' || name === 'recieverEmail'){
//       const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details[name].value)
//       console.log('validEmail',validEmail, name)
//       if(!validEmail){
//         item = {...details[name], ...{
//           hasError:true,
//           errorMessage:"Invalid name!"
//          }}
//         details = {...details, ...{[name]:item}}
//       }
//     }

//     if(name === 'senderMobile' || name === 'recieverMobile' ){
//       const validNumber = /^\d+$/.test(details[name].value);
//       if(!validNumber || !(details[name].value.length === 10)){
//         item = {...details[name], ...{
//           isRequired:true,
//           accepted:false,
//           errorMessage:"Invalid phone number!"
//         }}
//         details = {...details, ...{[name]:item}}
//       }
//     }

//     if(name === 'senderName' || name === 'recieverName' ){
//       const validString = /^[A-Za-z]+$/.test(details[name].value);
//       if(!validString){
//         item = {...details[name], ...{
//           isRequired:true,
//           accepted:false,
//           errorMessage:"Invalid name!"
//         }}
//         details = {...details, ...{[name]:item}}
//       }
//     }

//     if(details[name].isRequired &&
//       (details[name].value === "" ||
//         details[name].value === null ||
//           details[name].value === undefined)
//     ){
//       item = {...details[name], ...{ isRequired:true, accepted:false }}
//       details = {...details, ...{[name]:item}}
//     }
//     setState({...state, ...{details}});
//   }

//   const onSelectChange = (value)=>{
//     const destination = {...state.details.destination, ...{value, accepted:true}}
//     const details = {...state.details, ...{destination}}
//     setState({...state, ...{details}});
//   }

//   const onTypeChange = (e)=>{
//     const value = e.target.value;
//     let details = state.details;
//     const type = {...details.type, ...{value}}
//     const paxs = {...details.paxs, ...{isRequired: value !== 3, disabled:value === 3 }}
//     details = {...details, ...{type,paxs}}
//     setState({...state, ...{details}});
//   }

//   const getReviewDetails = () =>{
//     return {
//       packageName:state.details.description.value,
//       packageWeight:state.details.packageWeight.value,
//       packageQty: state.details.quantity.value,
//       packageImages: [state.packageImagePreview],
//       recipientName: state.details.recieverName.value,
//       recipientEmail: state.details.recieverEmail.value,
//       recipientPhone: state.details.recieverMobile.value,
//       senderName: state.details.senderName.value,
//       senderEmail: state.details.senderEmail.value,
//       senderPhone: state.details.senderMobile.value,
//       convenienceFee: state.details.systemFee.value,
//       insuranceFee: state.details.packageInsurance.value,
//       price: state.details.shippingCost.value,
//       totalPrice: state.details.totalShippingCost.value,
//       additionalNote:state.details.additionNote.value,
//       billOfLading: state.details.billOfLading,
//     }
//   }

//   const stepSelection = (step) =>{

//     let view = null;

//     switch (step) {
//       case 0:
//         view = <>
//             <ParcelDetailsForm
//               onBlur={(name)=>onBlurValidation(name)}
//               details={state.details}
//               onTypeChange={(e)=>onTypeChange(e)}
//               onSelectChange={(value)=>onSelectChange(value)}
//               onChange={(e)=>ParcelDetailsFormOnChange(e.target.name, e.target.value)} />
//             <StepControllerView />
//             </>
//         break;
//       case 1:
//         view = <>
//             <WebCam image = {state.packageImagePreview} onCapture={onCaptureImage}/>
//             <StepControllerView />
//           </>
//         break;
//       case 2:
//         view = <>
//             <ScheduledTrips
//               onSelect={e=>onSelectTrip(e)}
//               tripShedules={state.trips}
//               windowSize={size} />
//             <StepControllerView disableNextButton={true}/>
//           </>
//         break;
//       case 3:
//         view = <>
//             <ReviewDetails
//               onChange={(e)=>ParcelDetailsFormOnChange(e.target.name, e.target.value)}
//               value={getReviewDetails()}
//               viewMode={false} />
//             <StepControllerView
//               disabled={state.isLoading}
//               nextButtonName = "Create Parcel"
//               enablePreviousButton={true}
//               onNextStep={()=> {validateStep()}
//               }
//             />
//           </>
//         break;
//       case 4:
//         view = <>
//             <div ref={el => (printEl = el)}><TicketView data={state.createParcelResponseData}/></div>
//             <div className="on-step4-button-group">
//               <ReactToPrint
//                 content={() => printEl}
//                 trigger={() => { return <Button>Print Parcel</Button> }}/>
//               <Button className="btn-create-new-parcel" onClick={onCreateNewParcel}>Create New Parcel</Button>
//             </div>
//           </>
//         break;

//       default:
//         break;
//     }
//     return(<div className="content-section">{ view }</div>)
//   }

//   const validateStep = () =>{

//     if(state.verifiedSteps >= 4){
//       console.log('already created.. no more modification')
//       return;
//     }

//     if(state.currentStep === 0){
//       let hasError = false;
//       const exclude = ['billOfLading']
//       Object.keys(state.details).map((e)=>{
//         let name = state.details[e].name;
//         let value = state.details[e].value;
//         let isRequired = state.details[e].isRequired;
//         if(!exclude.includes(name) && (isRequired && (value === null || value === '' || value === undefined))){
//           hasError = true;
//         }
//       })
//       if(hasError){
//         showNotification({title:"Parcel Details Validation", type:'error', message:"Please fill up required fields"})
//         let details= state.details;
//         Object.keys(state.details).map(e=>{
//           let value = state.details[e].value;
//           let isRequired = state.details[e].isRequired;

//           if(isRequired && (value === null || value === '' || value === undefined)){
//             let item = {...details[e], ...{accepted:false} }
//             details = {...details, ...{[e]:item}}
//           }
//         });
//         setState({...state,...{details}})
//         return;
//       }
//     }

//     if(state.currentStep === 1){
//       if(!state.packageImagePreview || state.packageImagePreview === ''){
//         showNotification({title:"Parcel Image Validation", type:'error', message:"Please take photo and continue"})
//         return;
//       }
//     }

//     if(state.currentStep === 2){
//         if(!state.selectedTrip){
//           showNotification({title:"Trip Schedule Validation", type:'error', message:"Please select trip"})
//           return;
//         }
//     }

//     if(state.currentStep === 3){
//       if(state.details.billOfLading.value === undefined){
//         showNotification({title:"Create Parcel Validation", type:'error', message:"Please fill up required fields"})
//         let details = state.details;
//         const billOfLading = {...details.billOfLading, ...{accepted:false}}
//         details={...details,...{billOfLading}}
//         setState({...state,...{details}})
//       }else{
//         setState({...state,...{isLoading:true}})
//         ParcelService.create(state).then(e=>{
//           console.log('======>>createParcel', e)
//           const{ success, data, errorCode }=e.data;
//           if(success){
//             gotoNextStep();
//             setState({...state, ...{createParcelResponseData:data}})
//             showNotification({title:"Create Parcel", type:'success', message:"Your parcel is successfully created!"})
//           }else{
//             console.log('create parcel errorCode:',errorCode)
//             showNotification({title:"Create Parcel", type:'error', message:"Something went wrong"})
//           }
//           setState({...state, ...{isLoading:false} })
//         })
//       }
//       return;
//     }

//     gotoNextStep();
//   }

//   const gotoNextStep = () =>{
//     let verifiedSteps = state.currentStep
//       if(state.currentStep + 1 > verifiedSteps){
//         verifiedSteps = verifiedSteps + 1;
//       }
//       const currentStep = state.currentStep + 1;
//       setState({...state,...{currentStep,verifiedSteps}})
//   }

//   const onPreviousStep = () =>{
//     if(state.currentStep > 0 && state.verifiedSteps < 4){
//       const currentStep = state.currentStep - 1;
//       setState({...state,...{currentStep}})
//     }
//   }

//   const onChangeSteps = (step) =>{
//     if(state.verifiedSteps >= step){
//       setState({...state,...{currentStep:step}})
//     }
//   }

//   return (
//     <Layout className="create-parcelview-parent-container">

//       <Header className="home-header-view" style={{padding:0}}>
//         <div style={{ float: 'left' }}>
//           <Button type="link" onClick={() => props.history.goBack()}>
//             <ArrowLeftOutlined style={{ fontSize: '20px', color: '#fff' }} />
//             <span style={{ fontSize: '20px', color: '#fff' }}>Home</span>
//           </Button>
//         </div>
//       </Header>

//       <Layout>
//         {
//           size.width > MIN_WIDTH &&
//           <Sider width={200} className="create-side-bar">
//             <div style={{marginLeft:'1rem', marginTop:'1rem'}}>
//               <StepsView
//                 stepList={STEPS_LIST}
//                 current={state.currentStep}
//                 onchange={(s)=>onChangeSteps(s)}
//                 direction="vertical"/>
//             </div>
//           </Sider>
//         }
//         <Content>
//           <div className="create-content-container">
//             <div className={`horizontal-step ${size.width > MIN_WIDTH ? 'hide' : ""}`}>
//               <StepsView
//                 stepList={STEPS_LIST}
//                 current={state.currentStep}
//                 onchange={(s)=>onChangeSteps(s)}
//                 progressDot={true}
//                 direction="horizontal" />
//             </div>
//             { stepSelection(state.currentStep) }
//           </div>
//         </Content>
//       </Layout>

//     </Layout>
//   );
// }


const showNotification = props => {
  notification[props.type]({
    message: props.title || 'Notification Title',
    description: props.message || 'message',
  });
};

const StepControllerView = (props) =>{
  return (
  <div className={[`step-controller-container-item ${ props.width < 500 ? "button-steps" : ""}` ]}>
  {
    !props.disablePreviousButton &&
    <Button className="create-btn btn-prev" onClick={()=>{props.onPreviousStep()}}>{props.previousButtonName || "Previous"}</Button>
  }
  {
    !props.disableNextButton &&
    <Button
      disabled={props.disabled}
      className={`${props.disabled ? 'create-btn disabled-btn' :"create-btn btn-next"}`}
      onClick={()=>{props.onNextStep()}}>{props.nextButtonName || "Next"}</Button>
  }
  </div>)
}

const getReviewDetails = (state) =>{
  return {
    packageName:state.details.description.value,
    packageWeight:state.details.packageWeight.value,
    packageQty: state.details.quantity.value,
    packageImages: [state.packageImagePreview],
    recipientName: state.details.recieverName.value,
    recipientEmail: state.details.recieverEmail.value,
    recipientPhone: state.details.recieverMobile.value,
    senderName: state.details.senderName.value,
    senderEmail: state.details.senderEmail.value,
    senderPhone: state.details.senderMobile.value,
    convenienceFee: state.details.systemFee.value,
    insuranceFee: state.details.packageInsurance.value,
    price: state.details.shippingCost.value,
    totalPrice: state.details.totalShippingCost.value,
    additionalNote:state.details.additionNote.value,
    billOfLading: state.billOfLading,
  }
}

class CreateParcel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      packageImagePreview: null,
      currentStep: 0,
      verifiedSteps: 0,
      trips: undefined,
      selectedTrip: undefined,
      createParcelResponseData: undefined,
      previousButtonName: "Previous",
      nextButtonName: "Next",
      page: 1,
      checkIn: false,
      isLoading: false,
      billOfLading: {
        name: "billOfLading",
        value: undefined,
        isRequired: true,
        accepted: true,
      },
      details: {
        senderName: {
          name: "senderName",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        senderMobile: {
          name: "senderMobile",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        senderEmail: {
          name: "senderEmail",
          value: undefined,
          isRequired: false,
          accepted: true,
          hasError: false,
        },
        recieverName: {
          name: "recieverName",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        recieverMobile: {
          name: "recieverMobile",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        recieverEmail: {
          name: "recieverEmail",
          value: undefined,
          isRequired: false,
          accepted: true,
          hasError: false,
        },
        destination: {
          name: "destination",
          value: undefined,
          isRequired: true,
          accepted: true,
          options: [],
        },
        description: {
          name: "description",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        declaredValue: {
          name: "declaredValue",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        quantity: {
          name: "quantity",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        systemFee: {
          name: "systemFee",
          value: 0,
          isRequired: false,
          accepted: true,
        },
        additionNote: {
          name: "additionNote",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        packageInsurance: {
          name: "packageInsurance",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        type: {
          name: "type",
          value: 3,
          isRequired: false,
          accepted: true,
          options: [
            {
              value: 1,
              name: "Excess AC",
            },
            {
              value: 2,
              name: "Excess Non AC",
            },
            {
              value: 3,
              name: "Cargo Padala",
            },
          ],
        },
        packageWeight: {
          name: "packageWeight",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        shippingCost: {
          name: "shippingCost",
          value: 0,
          isRequired: false,
          accepted: true,
        },
        totalShippingCost: {
          name: "totalShippingCost",
          value: 0,
          isRequired: false,
          accepted: true,
        },
        paxs: {
          name: "paxs",
          value: undefined,
          isRequired: false,
          accepted: true,
          disabled: false,
        },
      }
    };

    window.addEventListener("resize", (e) => {
      this.setState({
        height: e.currentTarget.innerHeight,
        width: e.currentTarget.innerWidth,
      });
    });
    this.getConvinienceFee = debounce(this.getConvinienceFee,1000)
    this.computePrice = debounce(this.computePrice,1000)

    this.printEl = React.createRef();
  }

  componentDidMount(){
    const stationId = getUser().assignedStation._id;
    ParcelService.getTrips(stationId).then(e=>{
      console.log('getTrips====>>',e)
      const{data, success, errorCode}=e.data;
      if(success){
        if(data.trips){
          const details = {...this.state.details}
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
          const destination = {...details.destination, ...{options}}
          this.setState({
            trips:data.trips.data, 
            details:{...details, ...{destination}}
          })
        }
      }else{
        openNotificationWithIcon('error', errorCode, ()=>{
          clearCredential();
          this.props.history.push('/')
        })
      }
    })
  }

  gotoNextStep = () => {
    let verifiedSteps = this.state.verifiedSteps;
    let currentStep = this.state.currentStep;

    if (currentStep + 1 > verifiedSteps) {
      verifiedSteps = verifiedSteps + 1;
    }
    currentStep = currentStep + 1;
    this.setState({ currentStep, verifiedSteps });
  };

  onPreviousStep = () => {
    let verifiedSteps = this.state.verifiedSteps;
    let currentStep = this.state.currentStep;

    if (currentStep > 0 && verifiedSteps < 4) {
      currentStep = currentStep - 1;
      this.setState({ currentStep });
    }
  };

  updateSteps = (currentStep) => {
    if (this.state.verifiedSteps >= currentStep) {
      this.setState({ currentStep });
    }
  };

  createParcel =() =>{
    showNotification({
      title: "Create Parcel",
      type: "info",
      message: "The System is processing the parcel. Please wait for a while!",
    });
    this.setState({ isLoading: true });
    ParcelService.create(this.state).then((e) => {
      this.setState({ isLoading: false });

      console.log("======>>createParcel", e);
      const { success, data, errorCode } = e.data;
      if (success) {
        showNotification({
          title: "Create Parcel",
          type: "success",
          message: "Your parcel is successfully created!",
        });
        this.setState({createParcelResponseData: data},this.gotoNextStep());
      } else {
        console.log("create parcel errorCode:", errorCode);
        showNotification({
          title: "Create Parcel",
          type: "error",
          message: "Something went wrong",
        });
      }
    });
  }

  isRequiredDetailsHasNull = () =>{
    let hasError = false;
    let _details = { ...this.state.details };

      for (let i = 0; i < Object.keys(_details).length; i++) {
        let name = Object.keys(_details)[i];
        if (_details[name].isRequired && isNull(_details[name].value)) {
          hasError = true;
          break;
        }
      }
      return hasError;
  }

  validateStep = () => {
    let { 
      currentStep, 
      verifiedSteps, 
      details, 
      packageImagePreview,
      selectedTrip,
      billOfLading 
    } = this.state;

    if (verifiedSteps >= 4) {
      console.log("already created.. no more modification");
      return false;
    }

    if (currentStep === 0) {
      if (this.isRequiredDetailsHasNull()) {
        showNotification({
          title: "Parcel Details Validation",
          type: "error",
          message: "Please fill up required fields",
        });

        let tempDetails = {...details}
        Object.keys(details).forEach((e) => {
          if (details[e].isRequired && isNull(details[e].value)) {
            const item = Object.assign({}, details[e], { accepted: false });
            tempDetails = Object.assign({}, details, { [e]: item });
          }
        });

        this.setState({ details: tempDetails });
        return false;
      }
    }

    if (currentStep === 1) {
      if (isNull(packageImagePreview)) {
        showNotification({
          title: "Parcel Image Validation",
          type: "error",
          message: "Please take photo and continue",
        });
        return false;
      }
    }

    if (currentStep === 2) {
      if (!selectedTrip) {
        showNotification({
          title: "Trip Schedule Validation",
          type: "error",
          message: "Please select trip",
        });
        return false;
      }
    }

    if (currentStep === 3) {
      if (isNull(billOfLading.value)) {
        showNotification({
          title: "Create Parcel Validation",
          type: "error",
          message: "Please fill up required fields",
        });
        const billOfLading = {
          ...this.state.billOfLading,
          ...{ accepted: false },
        };
        this.setState({ billOfLading });
        return false;
      }
      if(this.isRequiredDetailsHasNull()){
        showNotification({
          title: "Create Parcel Validation",
          type: "error",
          message: "Please fill up required fields",
        });
        return false;
      }
    }

    return true
  };

  getConvinienceFee = (qty) =>{
    ParcelService.getConvenienceFee(qty).then(res=>{
      console.log('===>>response',res)
      let details = {...this.state.details}
      let systemFee= {...this.state.details.systemFee}
      const { success, data } = res.data;
      if (success) {
        systemFee = Object.assign({},systemFee,{ value: data.convenienceFee })
      }
      this.setState({ details: Object.assign(details,{systemFee}) })
    })

    // let details = {...this.state.details}
    // let systemFee= {...this.state.details.systemFee}
    // ParcelService.getConvenienceFee(qty)
    // .then(res=>{
    //   console.log('====>>res',res)
    //   const { success, data } = res.data;
    //   if (success) {
    //     systemFee = Object.assign({},systemFee,{ value: data.convenienceFee })
    //   }
    //   this.setState({ details: Object.assign(details,{systemFee}) })
    // });
  }

  computePrice = () =>{
    const{ 
      destination, 
      declaredValue, 
      paxs, 
      packageWeight, 
      type 
    }= this.state.details

    const busCompanyId = getUser().busCompanyId;
    const startStation = getUser().assignedStation._id;

    const endStationOption = destination.options.filter(e=>e.value === destination.value)[0]
    const endStation = endStationOption ? endStationOption.data.endStation._id : undefined;
   
    const decValue = declaredValue.value ? parseFloat(declaredValue.value).toFixed(2) : undefined;
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
      )
      .then(e => {
        console.log('computePrice====>>response',e)
        const details = {...this.state.details}
        const{ data, success, errorCode }=e.data;
        if(success){
          const shippingCost = {...details.shippingCost, ...{value:parseFloat(data.totalCost).toFixed(2)}}
          this.setState({details:{...details, ...{shippingCost}}})
        }
        else{
          showNotification({
            title: errorDetails[errorCode].message,
            type: "error",
            message: errorDetails[errorCode].description
          });
        }
      })
    }
  }

  onInputChange = (name, value) => {

    console.log('name',name)
    console.log('value',value)
    let details = {...this.state.details};

      if (name === "senderEmail" || name === "recieverEmail") {
        let item = { ...details[name], ...{ value, hasError: false } };
        let _details = { ...details, ...{ [name]: item } };
        this.setState({details:_details})
        return;
      } 

      let item = { ...details[name], ...{ value, accepted: !isNull(value) } };
      details = { ...details, ...{ [name]: item } };
      

      if(name === "quantity"){
        this.getConvinienceFee(value)
      }

      console.log('details',details)

      if (name === "declaredValue") {
        const packageInsurance = {
          ...details.packageInsurance,
          ...{ value: parseFloat(value * 0.1).toFixed(2) },
        };
        details = { ...details, ...{ packageInsurance } };
      }

      if (name === "billOfLading") {
        console.log('!isNull(value)',!isNull(value))
        this.setState({billOfLading:{...this.state.billOfLading, ...{value, accepted: !isNull(value)}}})
        return;
      }

      this.setState({details})
  };

  onBlurValidation = (name)=>{
    let item;
    let details = this.state.details;

    if(name === 'senderEmail' || name === 'recieverEmail'){
      const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details[name].value)
      console.log('validEmail',validEmail, name)
      if(!validEmail){
        item = {...details[name], ...{
          hasError:true,
          errorMessage:"Invalid name!"
          }}
        details = {...details, ...{[name]:item}}
      }
      this.setState({details})
      return;
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
      this.setState({details})
      return;
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
      this.setState({details})
      return;
    }

    if(details[name].isRequired && isNull(details[name].value)){
      item = {...details[name], ...{ isRequired:true, accepted:false }}
      details = {...details, ...{[name]:item}}
    }

    this.setState({details});
  }
    
  onSelectChange = (value)=>{
    let details = {...this.state.details};
    const destination = {...details.destination, ...{ value, accepted:true}}
    this.setState({ details: {...details, ...{destination}} });
  }
    
  onTypeChange = (value)=>{
    const details={...this.state.details};
    const type = {...details.type, ...{value}}
    const paxs = {...details.paxs, ...{ isRequired: value !== 3, disabled:value === 3 }}
    this.setState({details:{...details, ...{type, paxs}}});
  }

  onCreateNewParcel =()=>{
    this.setState({
      billOfLading: {
        name: "billOfLading",
        value: undefined,
        isRequired: true,
        accepted: true,
      },
      packageImagePreview: null,
      currentStep: 0,
      verifiedSteps: 0,
      trips: undefined,
      selectedTrip: undefined,
      createParcelResponseData: undefined,
    },()=>{
      let tempDetails = {...this.state.details}
      Object.keys(tempDetails).forEach((e) => {
        if (tempDetails[e].isRequired && isNull(tempDetails[e].value)) {
          const item = Object.assign({}, tempDetails[e], { accepted: true, value:undefined });
          tempDetails = Object.assign({}, tempDetails, { [e]: item });
        }
      });
      this.setState({ details: tempDetails });
    })
  }

  stepView = (step) => {
    let view = null;

    switch (step) {
      case 0:
        view = (
          <>
            <ParcelDetailsForm
              onBlur={(name) => this.onBlurValidation(name)}
              details={this.state.details}
              onTypeChange={(e) => this.onTypeChange(e.target.value)}
              onSelectChange={(value) => this.onSelectChange(value)}
              onChange={(e) => this.onInputChange(e.target.name, e.target.value) }
            />
            <StepControllerView
              width={this.state.width}
              onNextStep={() => {
                if (this.validateStep()) {
                  this.gotoNextStep();
                }
              }}
            />
          </>
        );
        break;
      case 1:
        view = (
          <>
            <WebCam
              image={this.state.packageImagePreview}
              onCapture={(packageImagePreview) => this.setState({ packageImagePreview })}
            />
            <StepControllerView 
              width={this.state.width}
              onNextStep={() => {
                if (this.validateStep()) {
                  this.gotoNextStep();
                }
              }
            }/>
          </>
        );
        break;
      case 2:
        view = (
          <>
            <ScheduledTrips
              onSelect={(selectedTrip)=>this.setState({selectedTrip},()=>{
                if (this.validateStep()) {
                  this.gotoNextStep();
                }
              })}
              tripShedules={this.state.trips}
              windowSize={this.state.width}
            />
          </>
        );
        break;
      case 3:
        view = (
          <>
            <ReviewDetails
              onChange={(e) =>this.onInputChange(e.target.name, e.target.value)}
              value={getReviewDetails(this.state)}
              viewMode={false}
            />
            <StepControllerView
              disabled={this.state.isLoading}
              nextButtonName="Create Parcel"
              enablePreviousButton={true}
              onNextStep={() => {
                if(this.validateStep()){
                  this.createParcel()
                }
              }}
            />
          </>
        );
        break;
      case 4:
        view = (
          <>
            <div ref={(el) => (this.printEl = el)}>
              <TicketView data={this.state.createParcelResponseData} />
            </div>
            <div className="on-step4-button-group">
              <ReactToPrint
                content={() => this.printEl}
                trigger={() => {
                  return <Button>Print Parcel</Button>;
                }}
              />
              <Button
                className="btn-create-new-parcel"
                onClick={()=>this.onCreateNewParcel()}
              >
                Create New Parcel
              </Button>
            </div>
          </>
        );
        break;

      default:
        break;
    }
    return <div className="content-section">{view}</div>;
  };

  componentDidUpdate(prevProps, prevState){
    const currentDetails = this.state.details;
    const{ destination, packageWeight, declaredValue, paxs }=prevState.details;

    if(currentDetails.destination.value !== destination.value
        || currentDetails.packageWeight.value !== packageWeight.value
          || currentDetails.declaredValue.value !== declaredValue.value){

      if(currentDetails.destination.value
          && currentDetails.packageWeight.value
            && currentDetails.declaredValue.value){
        if(currentDetails.type.value !== 3 && currentDetails.paxs.value === paxs.value){
          return;
        }
        this.computePrice();
      }
    }

    const total = parseFloat(currentDetails.packageInsurance.value || 0) + parseFloat(currentDetails.systemFee.value || 0) + parseFloat(currentDetails.shippingCost.value) ;
    const totalShippingCost = parseFloat(currentDetails.totalShippingCost.value || 0).toFixed(2) ;
    if(parseFloat(total).toFixed(2) !== totalShippingCost){
      const totalShippingCost = {...currentDetails.totalShippingCost,...{value:parseFloat(total).toFixed(2)}}
      this.setState({details: {...currentDetails, ...{totalShippingCost}}})
    }

    console.log('componentDidUpdate----->>>>')
  }

  render() {
    const { width } = this.state;
    return (
      <Layout className="create-parcelview-parent-container">
        <Header className="home-header-view" style={{ padding: 0 }}>
          <div style={{ float: "left" }}>
            <Button type="link" onClick={() => this.props.history.goBack()}>
              <ArrowLeftOutlined style={{ fontSize: "20px", color: "#fff" }} />
              <span style={{ fontSize: "20px", color: "#fff" }}>Home</span>
            </Button>
          </div>
        </Header>

        <Layout>
          {width > MIN_WIDTH && (
            <Sider width={200} className="create-side-bar">
              <div style={{ marginLeft: "1rem", marginTop: "1rem" }}>
                <StepsView
                  stepList={STEPS_LIST}
                  current={this.state.currentStep}
                  onchange={(s) => this.updateSteps(s)}
                  direction="vertical"
                />
              </div>
            </Sider>
          )}
          <Content>
            <div className="create-content-container">
              <div className={`horizontal-step ${width > MIN_WIDTH ? "hide" : ""}`}>
                <StepsView
                  stepList={STEPS_LIST}
                  current={this.state.currentStep}
                  onchange={(s) => this.updateSteps(s)}
                  progressDot={true}
                  direction="horizontal"
                />
              </div>
              {this.stepView(this.state.currentStep)}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default CreateParcel;
