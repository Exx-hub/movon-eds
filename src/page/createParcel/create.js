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
    nextButtonName:"Next"
  });
  
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
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
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

  const stepSelection = (step) =>{

    let view = null;
    
    switch (step) {
      case 0:
        view = <>
            <ParcelDetailsForm onchange={onchange}/>
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