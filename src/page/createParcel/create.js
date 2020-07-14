import React from "react";
import "./create.scss";
import ParcelDetailsForm from "../../component/forms/createParcelForm";
import StepsView from "../../component/steps";
import WebCam from "../../component/webcam";
import ScheduledTrips from "../../component/scheduledTrips";
import ReviewDetails from "../../component/reviewDetails";
import TicketView from "../../component/ticketView";
import {
  Button,
  notification,
  Layout,
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

const USER = getUser();
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

const parceResponseData = (data) =>{
  const logo = USER.busCompanyId.logo;
  const name = USER.busCompanyId.name
  
  const endStationName = data.trips ? data.trips.endStationName : data.endStation.name
  const startStationName = data.trips ? data.trips.startStationName : data.startStation.name

  return {
    packageName:data.packageInfo.packageName,
    packageWeight:data.packageInfo.packageWeight,
    packageQty: data.packageInfo.quantity,
    packageImages: data.packageInfo.packageImages,
    recipientName: data.recipientInfo.recipientName,
    recipientEmail: data.recipientInfo.recipientEmail,
    recipientPhone: "+63"+data.recipientInfo.recipientPhone.number,
    senderName: data.senderInfo.senderName,
    senderEmail: data.senderInfo.senderEmail,
    senderPhone: "+63"+data.senderInfo.senderPhone.number,
    convenienceFee: data.priceDetails.convenienceFee,
    insuranceFee: data.priceDetails.insuranceFee,
    price: data.priceDetails.price,
    totalPrice: data.priceDetails.totalPrice,
    additionalNote:data.additionalNote,
    billOfLading: data.billOfLading,
    busCompanyName: name,
    busCompanyLogo: logo,
    endStationName,
    startStationName,
    tripCode: data.trips ? data.trips.displayId : data.tripCode,
    //tripDate: data.trips.tripStartDateTime,
    scanCode: data.scanCode,
    createdAt: data.createdAt,
    subParcels: data.subParcels
  }
}

class CreateParcel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth, 
      height: window.innerHeight,
      packageImagePreview: null,
      currentStep: 0,
      verifiedSteps: 0,
      trips: undefined,
      selectedTrip: undefined,
      createParcelResponseData: undefined,
      previousButtonName: "Previous",
      nextButtonName: "Next",
      page: 1,
      checkIn: true,
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
          disabled:true
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
          disabled: true,
        },
      },
      payment:{
        matrix:0,
        p2pMatrix:0,
        enableP2P:false
      },
      enalbeBicolIsarogWays:false
    };

    window.addEventListener("resize", (e) => {
      this.setState({
        height: e.currentTarget.innerHeight,
        width: e.currentTarget.innerWidth,
      });
    });

    this.getConvinienceFee = debounce(this.getConvinienceFee,1000)
    this.computePrice = debounce(this.computePrice,1000)
    this.getMatrixFare = debounce(this.getMatrixFare,1000)

    this.printEl = React.createRef();

    const externalCompany = USER && USER.busCompanyId.constexternalCompany
    this.setState({enalbeBicolIsarogWays: externalCompany === 2})
  }

  componentDidMount(){
    const stationId = USER && USER.assignedStation._id;
    ParcelService.getTrips(stationId).then(e=>{
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
        this.handleErrorNotification(errorCode)
      }
    })
  }

  handleErrorNotification = (code) =>{

    if(isNull(code)){
      showNotification({
        title: "Server Error",
        type: "error",
        message: "Something went wrong",
      });
      return;
    }

    if(code === 1000){
      openNotificationWithIcon('error', code, ()=>{
        clearCredential();
        this.props.history.push('/')
      })
      return;
    }
    openNotificationWithIcon('error', code);
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
      const { success, data, errorCode } = e.data;
      if (success) {
        showNotification({
          title: "Create Parcel",
          type: "success",
          message: "Your parcel is successfully created!",
        });
        this.setState({createParcelResponseData: data},()=>this.gotoNextStep());
      } else {
        this.handleErrorNotification(errorCode)
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
        if(!_details[name].accepted){
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
        Object.keys(tempDetails).forEach((e) => {
          if (tempDetails[e].isRequired && isNull(tempDetails[e].value)) {
            const item = {...tempDetails[e], ...{ accepted: false }} 
            tempDetails = {...tempDetails, ...{[e]:item}}  
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
      let details = {...this.state.details}
      let systemFee= {...this.state.details.systemFee}
      const { success, data, errorCode } = res.data;
      if (success) {
        systemFee = Object.assign({},systemFee,{ value: data.convenienceFee })
        this.setState({ details: Object.assign(details,{systemFee}) })
      }else{
        this.handleErrorNotification(errorCode)
      }
    })
  }

  computePrice = () =>{
    const{ 
      destination, 
      declaredValue, 
      paxs, 
      packageWeight, 
      type 
    }= this.state.details

    const busCompanyId =  USER && USER.busCompanyId._id || undefined;
    const startStation =  USER && USER.assignedStation._id || undefined;

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
        const details = {...this.state.details}
        const{ data, success, errorCode }=e.data;
        if(success){
          const shippingCost = {...details.shippingCost, ...{value:parseFloat(data.totalCost).toFixed(2)}}
          this.setState({details:{...details, ...{shippingCost}}})
        }else{
          this.handleErrorNotification(errorCode)
        }
      })
    }
  }

  /** computation for interconnected bus company*/
  addCombineP2PPricing = () =>{
    if(this.state.enableP2P){
      //do computation here...
    }
  }

  onInputChange = (name, value) => {
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
      if(typeof value === 'number' && value > -1)
        this.getConvinienceFee(value)
    }

    if (name === "declaredValue") {
      if(typeof value === 'number' && value > -1){
        const packageInsurance = {
          ...details.packageInsurance,
          ...{ value: parseFloat(value * 0.1).toFixed(2) },
        };
        details = { ...details, ...{ packageInsurance } };
      }
    }

    if (name === "billOfLading") {
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
      
      let hasError = true;
      if(details[name].value){
        const fullName =  details[name].value.split(" ");
        if(fullName.length > 1){
          hasError = false
        }else{
          for(let i=0; i<fullName.length; i++){
            const validString = /^[A-Za-z]+$/.test(fullName[i]);
            if(validString){
              hasError = false;
              break;
            }
          }
        }
      }
      
      if(hasError){
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

    if(name === 'declaredValue' || name === 'quantity' || name==='packageWeight'){
      if(typeof details[name].value !== 'number' || details[name].value < 0){
        item = {...details[name], ...{ isRequired:true, accepted:false, errorMessage:'invalid entry' }}
        details = {...details, ...{[name]:item}}
        this.setState({details});
      }
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
    const selectedDestination = details.destination.options.filter(e=>e.value === value)[0].data
    const destination = {...details.destination, ...{ value, accepted:true}}
    details = {...details, ...{destination}}
    this.setState({ details, selectedDestination });
  }
    
  onTypeChange = (value)=>{
    const details={...this.state.details};
    const type = {...details.type, ...{value}}
    const paxs = {...details.paxs, ...{ value:0, isRequired: value !== 3, disabled: value === 3 }}
    const quantity = {...details.quantity, ...{ value:0 }}
    const packageWeight = {...details.packageWeight, ...{ value:0 }}
    const systemFee = {...details.systemFee, ...{ value:0 }}
    const totalShippingCost = {...details.totalShippingCost, ...{ value:0 }}
    const shippingCost = {...details.shippingCost, ...{ value:0 }}
    this.setState({details:{...details, ...{
      systemFee,
      totalShippingCost,
      type, 
      shippingCost,
      paxs, 
      quantity, 
      packageWeight}}});
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
              onPreviousStep={()=>this.onPreviousStep()}
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
              onPreviousStep={()=>this.onPreviousStep()}
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
            <StepControllerView
              width={this.state.width}
              disableNextButton={true}
              onPreviousStep={()=>this.onPreviousStep()}
              onNextStep={() => {}}
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
              onPreviousStep={()=>this.onPreviousStep()}
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
              <TicketView value={parceResponseData(this.state.createParcelResponseData)} />
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

        if(this.state.enalbeBicolIsarogWays){
          this.computePrice();
          this.addP2PPricing();
        }else{
          this.getMatrixFare();
        }
      }
    }

    this.updateTotalShippingCost();
  }

  updateTotalShippingCost = () =>{
    const currentDetails = this.state.details;
    let total = parseFloat(currentDetails.shippingCost.value) ;
    
    if(this.state.enalbeBicolIsarogWays){
      total += parseFloat(currentDetails.systemFee.value || 0);
    }

    const totalShippingCost = parseFloat(currentDetails.totalShippingCost.value || 0).toFixed(2) ;
    if(parseFloat(total).toFixed(2) !== totalShippingCost){
      const totalShippingCost = {...currentDetails.totalShippingCost,...{value:parseFloat(total).toFixed(2)}}
      this.setState({details: {...currentDetails, ...{totalShippingCost}}})
    }
  }

  getMatrixFare = () =>{
    const{ details, selectedDestination }=this.state

    ParcelService.getFareMatrix(
        selectedDestination.busCompanyId._id, 
        details.declaredValue.value, 
        details.packageWeight.value, 
        selectedDestination.startStation._id, 
        selectedDestination.endStation._id )
      .then((e)=>{ 
        const{data, success, errorCode} = e.data
        if(success){
          const shippingCost = {...details.shippingCost, ...{value:parseFloat(data.price).toFixed(2)}}
          this.setState({details:{...details, ...{shippingCost}}})
          return;
        }
        this.handleErrorNotification(errorCode)
      })
  }

  render() {
    const { width } = this.state;
    return (
      <Layout className="create-parcelview-parent-container">
        <Header className="home-header-view" style={{ padding: 0 }}>
          <div style={{ float: "left" }}>
            <Button type="link" onClick={() => this.props.history.goBack()}>
              <ArrowLeftOutlined style={{ fontSize: "20px", color: "#fff" }} />
              <span style={{ fontSize: "20px", color: "#fff" }}>Create Parcel</span>
            </Button>
          </div>
        </Header>

        <Layout>
          { width > MIN_WIDTH && (
            <Sider width={200} className="create-side-bar">
              <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
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
