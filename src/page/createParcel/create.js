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
  Checkbox
} from "antd";
import ReactToPrint from "react-to-print";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ParcelService from "../../service/Parcel";
import MatrixService from "../../service/Matrix";
import {
  getUser,
  openNotificationWithIcon,
  clearCredential,
  debounce,
} from "../../utility";

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
    checkIn: state.checkIn
  }
}

const parceResponseData = (data) =>{
  const USER = getUser();
  const logo = (USER && USER.busCompanyId.logo) || undefined;
  const name = USER && USER.busCompanyId.name
  
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
    subParcels: data.subParcels,
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
        connectingCompany:{
          name: "connectingCompany",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
        },
        connectingRoutes:{
          name: "connectingRoutes",
          value: undefined,
          isRequired: false,
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
          title:"",
          placeholder:"Declared Value Rate",
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
              disabled:true,
            },
            {
              value: 2,
              name: "Excess Non AC",
              disabled:true,
            },
            {
              value: 3,
              name: "Cargo Padala",
              disabled:false,
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
        length: {
          name: "length",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
      },
      enalbeBicolIsarogWays:false,
      declaredValueAdditionFee:0.1,
      noOfStickerCopy:5,
      connectingCompanyComputation:0,
      tariffRate:undefined
    };
    this.getConvinienceFee = debounce(this.getConvinienceFee,1000)
    this.computePrice = debounce(this.computePrice,1000)
    this.getMatrixFare = debounce(this.getMatrixFare,1000)
    this.printEl = React.createRef();
  }

  componentWillUnmount(){
    window.removeEventListener("resize",e=>console.log('remove events',e))
  }

  componentDidMount(){
    window.addEventListener("resize", (e) => {
      this.setState({
        height: e.currentTarget.innerHeight,
        width: e.currentTarget.innerWidth,
      });
    });

    this.USER = getUser();
    const busCompanyId = (this.USER && this.USER.busCompanyId) || undefined
    let {details, noOfStickerCopy} = {...this.state};

    ParcelService.getConnectingBusPartners().then((e)=>{
      const{success, data, errorCode}=e.data;
      if(success){
        if(data){
          const connectingCompany = {...details.connectingCompany};
          connectingCompany.options = data.connectingRoutes;
          //connectingCompany.value = data.connectingRoutes[0]._id
          this.setState({ details:{...this.state.details, ...{connectingCompany}} })
        }
      }else{
        this.handleErrorNotification(errorCode)
      }
    })

    if(busCompanyId){
      const parcel = busCompanyId.config.parcel || undefined;
      if(parcel){
        noOfStickerCopy = parcel.noOfStickerCopy ? parcel.noOfStickerCopy : noOfStickerCopy
      }

      const length = {...details.length, ...{isRequired: false}};
      details = {...details, ...{length}}

      this.setState({
        enalbeBicolIsarogWays: busCompanyId.externalCompany === 1,
        noOfStickerCopy,
        details
      })
    }
   
    const stationId = this.USER && this.USER.assignedStation._id;
    ParcelService.getTrips(stationId).then(e=>{
      const{data, success, errorCode}=e.data;
      if(success){
        if(data.trips){
          const details = {...this.state.details}
          let _myOption =[] 

          data.trips.data.forEach(e=>{
            _myOption.push({
              name:e.endStation.name,
              value:e.endStation._id,
              startStationId:e.startStation._id,
              startStationName: e.startStation.name,
              companyId:e.busCompanyId._id,
              companyName: e.busCompanyId.name,
              tripStartDateTime: e.tripStartDateTime,
              busModel:e.bus.busModel,
              busId:e.bus.busId,
              tripsId:e._id,
              endStation:e.endStation._id
            })
            
          })
         
          let clean=[]
          _myOption = _myOption.filter(e=>{
            if(!clean.includes(e.value)){
              clean.push(e.value)
              return true
            }
            return false;
          })

          const destination = {...details.destination, ...{options:_myOption}}
          this.setState({
            tripOption:_myOption,
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
      openNotificationWithIcon('error', code);
      clearCredential();
      this.props.history.push('/');
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

  onBlurValidation = (name)=>{
    let details = {...this.state.details};

    if(isNull(details[name].value)){
      return null;
    }

    if(!isNull(details[name].value) && (name === 'senderEmail' || name === 'recieverEmail')){
      // eslint-disable-next-line
      const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(details[name].value)
      return {...details[name], ...{
        hasError: !validEmail,
        accepted: validEmail,
        errorMessage: validEmail ? "" : "Invalid Email!"
      }}
    }

    if(!isNull(details[name].value) && (name === 'senderMobile' || name === 'recieverMobile') ){
      const validNumber = /^\d+$/.test(details[name].value);
      const isValid = validNumber && details[name].value.length === 10
      return {...details[name], ...{
        accepted: isValid,
        errorMessage:"Invalid phone number!"
      }}
    }

  

    if(name === 'senderName' || name === 'recieverName' ){
      let isValid = true;
      if(details[name].value){
        const fullName =  details[name].value.trim().split(" ");
        isValid = fullName.length > 1;

        if(isValid){
          for(let i=0; i<fullName.length; i++){
            const validString = /^[A-Za-z]+$/.test(fullName[i]);
            if(!validString){
              isValid = false;
              break;
            }
          }
        }
      }

      return {...details[name], ...{
        accepted: isValid,
        errorMessage: !isValid ? "Invalid name!" : ""
      }}
    }

    if(name === 'declaredValue' || name === 'quantity' || name==='packageWeight'){
      const isValid = Number(details[name].value) > -1;
      return {...details[name], 
        ...{ 
          accepted: isValid, 
          errorMessage: isValid ? "" : 'Invalid number!' }}
    }
    return null;
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

    console.log('validateStep details', this.state.details)

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
      else{
        let hasError = false
        let tempDetails = {...details}
        Object.keys(tempDetails).forEach((e) => {
          let item =  this.onBlurValidation(e)
          if(item){
            hasError = true;
            tempDetails = {...tempDetails, ...{[e]:item}} 
          }
        });
        this.setState({ details: tempDetails });
        return hasError;
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

    const setSystemFee = (value) =>{
      let details = {...this.state.details}
      let systemFee= {...this.state.details.systemFee}
      systemFee = Object.assign({},systemFee,{ value })
      this.setState({ details: Object.assign(details,{systemFee}) })
    }

    if(!qty){
      setSystemFee(0)
      return
    }

    const updateState = (res) =>{
      console.log('updateState e',res.data)
      const { success, data, errorCode } = res.data;
      if (!success) {
        this.handleErrorNotification(errorCode)
      }
      setSystemFee((data && data.convenienceFee) || 0)
    }

    if(this.USER 
        && this.USER.busCompanyId 
          && this.USER.busCompanyId.config 
            && this.USER.busCompanyId.config.parcel 
              && this.USER.busCompanyId.config.parcel.tag && this.USER.busCompanyId.config.parcel.tag === 'five-star'){
                
      ParcelService.getFiveStarConvenienceFee(qty).then(res=>updateState(res))
      return;
    }
    ParcelService.getConvenienceFee(qty).then(res=>updateState(res));
  }

  computePrice = () =>{
    const{ 
      destination, 
      declaredValue, 
      paxs, 
      packageWeight, 
      type
    }= this.state.details

    const busCompanyId =  (this.USER && this.USER.busCompanyId._id) || undefined;
    const startStation =  (this.USER && this.USER.assignedStation._id) || undefined;
    const selectedOption = destination.options.filter(e=>e.value === destination.value)[0]
    const endStation = selectedOption.endStation || undefined;
    const decValue = declaredValue.value ? parseFloat(declaredValue.value).toFixed(2) : undefined;
    const pax = paxs.value || 0;
    const weight = packageWeight.value ? parseFloat(packageWeight.value).toFixed(2) : undefined

    if(!isNull(busCompanyId) && !isNull(startStation) && !isNull(endStation) && !isNull(weight) && !isNull(decValue) ){

      ParcelService.getDynamicPrice(
        busCompanyId,
        decValue,
        endStation,
        type.value,
        pax,
        startStation,
        weight,
      )
      .then(e => {
        console.log('getDynamicPrice',e)
        let details = {...this.state.details}
        const{ data, success, errorCode }=e.data;
        if(success){
          const shippingCost = {...details.shippingCost, ...{value:parseFloat(data.totalCost).toFixed(2)}}
          const packageInsurance = {...details.packageInsurance, ...{value:parseFloat(data.declaredRate).toFixed(2)}}
          details = {...details, ...{shippingCost}}
          details = {...details, ...{packageInsurance}}
          this.setState({details:{...details, ...{shippingCost}}})
        }else{
          this.handleErrorNotification(errorCode)
        }
      })
    }
  }

  onInputChange = (name, value) => {
    let details = {...this.state.details};

    if(name === "quantity"){
      const isValid = Number(value) > -1;
      let item = { ...details[name], ...{ 
        errorMessage: isValid ? "" : "Invalid number",
        value, 
        accepted: isValid } };
      details = { ...details, ...{ [name]: item } };

      this.setState({details},()=>{
        if(isValid){
          this.getConvinienceFee(value)
        }
      })
      return
    }

    if (name === "declaredValue") {
      const packageInsurance = {...details.packageInsurance};
      packageInsurance.value = 0;
      details = { ...details, ...{ packageInsurance } };
    }

    if (name === "billOfLading") {
      this.setState({billOfLading:{...this.state.billOfLading, ...{value, accepted: !isNull(value)}}})
      return;
    }

    
    let item = { ...details[name], ...{ value, accepted: true, hasError:false } };
    this.setState({details:{ ...details, ...{ [name]: item } }})
  };

  onSelectChange = (value,name)=>{

    let details = {...this.state.details};
    if(name === 'connectingCompany'){
      ParcelService.getConnectingRoutes(value).then((e)=>{
        const{data,success,errorCode}=e.data;
        if(!success)
          this.handleErrorNotification(errorCode);
        else{
          const connectingRoutes = {...details.connectingRoutes};
          connectingRoutes.options = data.map(e=>({start:e.start, end:e.end, endStationName:e.endStationName}))
          this.setState({ details:{...this.state.details, ...{connectingRoutes}} })
        }
      });      
      const connectingCompany = {...details.connectingCompany, ...{ value, accepted:true}}
      details = {...details, ...{connectingCompany}}
      this.setState({ details });
    }

    if(name === 'connectingRoutes'){
      const connectingRoutes = {...details.connectingRoutes, ...{ value, accepted:true}}
      details = {...details, ...{connectingRoutes}}
      this.setState({ details });
    }

    if(name === 'destination'){
      const selectedDestination = details.destination.options.filter(e=>e.value === value)[0]
      const destination = {...details.destination, ...{ value, accepted:true}}
      details = {...details, ...{destination}}
      this.setState({ details, selectedDestination });
    }
    
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
    window.location.reload(true);
  }

  stepView = (step) => {
    let view = null;

    switch (step) {
      case 0:
        view = (
          <>
            <ParcelDetailsForm
              enableInterConnection={this.state.enalbeBicolIsarogWays}
              onBlur={(name) =>{ 
                let item = this.onBlurValidation(name)
                if(item)
                  this.setState({details:{...this.state.details, ...{[name]:item}}})
              }}
              details={this.state.details}
              onTypeChange={(e) => this.onTypeChange(e.target.value)}
              onSelectChange={(value,name) => this.onSelectChange(value, name)}
              onChange={(e) => this.onInputChange(e.target.name, e.target.value) }
            />
          
            <StepControllerView
              width={this.state.width}
              onPreviousStep={()=>this.onPreviousStep()}
              onNextStep={() => {
                let isValid = this.validateStep()
                if (isValid) {
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
              onSelect={(selectedTrip)=>{
                this.setState({selectedTrip},()=>{
                  if (this.validateStep()) {
                    this.gotoNextStep();
                  }
                });
              }}
              selectedDestination={this.state.selectedDestination}
              tripOption={this.state.tripOption}
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
            <div className="center-horizontal-space-between">
              <div className="checkbox-container">
                <Checkbox checked={this.state.checkIn} onChange={(e)=>this.setState({checkIn:e.target.checked})}>Check In</Checkbox>
              </div>
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
            </div>
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
    const currentDetails = {...this.state.details};
    const{ destination, packageWeight, declaredValue, paxs, length }=prevState.details;
    const oldConnectingRoutes = prevState.details.connectingRoutes.value;
    const oldConnectingCompany = prevState.details.connectingCompany.value;

    if(currentDetails.destination.value !== destination.value
      || currentDetails.packageWeight.value !== packageWeight.value
        || currentDetails.declaredValue.value !== declaredValue.value
          || currentDetails.length.value !== length.value
            || oldConnectingRoutes !== currentDetails.connectingRoutes.value 
              || oldConnectingCompany !== currentDetails.connectingCompany.value){

      if(currentDetails.destination.value !== undefined
        && currentDetails.packageWeight.value !== undefined
          && currentDetails.declaredValue.value !== undefined){

        if(currentDetails.type.value !== 3 && currentDetails.paxs.value === paxs.value){
          return;
        }

        if(this.state.enalbeBicolIsarogWays){
          this.computePrice();

          if(currentDetails.connectingRoutes.value && currentDetails.connectingCompany.value){
            const destination = currentDetails.connectingRoutes.value 
            const associateId = currentDetails.connectingCompany.value
            const origin = currentDetails.connectingRoutes.options.filter(e=>e.end)[0].start;
            const weight = currentDetails.packageWeight.value
            const declaredValue = currentDetails.declaredValue.value
            
            if(destination && associateId && origin && weight && declaredValue){
              MatrixService.onConnectingRoutesComputation(associateId, origin, destination, weight, declaredValue)
              .then(e=>{
                console.log('onConnectingRoutesComputation',e)
                const{data, success, errorCode} = e.data
                if(success){
                  if(data){
                    this.setState({connectingCompanyComputation: data.total, tariffRate : e.tariffRate})
                  }
                }else{
                  this.setState({connectingCompanyComputation: 0, tariffRate : 0})
                  this.handleErrorNotification(errorCode);
                }
              })
            }
            
          }
        }else{
          this.getMatrixFare({
            declaredValue:currentDetails.declaredValue.value,
            weight:currentDetails.packageWeight.value,
            length:currentDetails.length.value || 0
          });
        }
      }
    }

    const oldDetails = prevState.details
    const curDetails = this.state.details

    if(oldDetails.shippingCost.value !== curDetails.shippingCost.value
      || oldDetails.systemFee.value !== curDetails.systemFee.value
        || oldDetails.packageInsurance.value !== curDetails.packageInsurance.value
          || prevState.connectingCompanyComputation !== this.state.connectingCompanyComputation)
      this.updateTotalShippingCost();
  }

  updateTotalShippingCost = () =>{
    const currentDetails = {...this.state.details};
    let total = parseFloat(currentDetails.shippingCost.value || 0) 
      + parseFloat(currentDetails.systemFee.value || 0)
        + parseFloat(currentDetails.packageInsurance.value || 0)
          + parseFloat(this.state.connectingCompanyComputation || 0)
    
    const totalShippingCost = {...currentDetails.totalShippingCost,...{value:parseFloat(total).toFixed(2)}}
    this.setState({details: {...currentDetails, ...{totalShippingCost}}})
  }

  getMatrixFare = ({weight,declaredValue, length}) =>{
    const{ details, selectedDestination }=this.state
    const origin = this.USER && this.USER.assignedStation._id;
    MatrixService.getMatrixComputation({
      origin,
      destination: selectedDestination.value,
      declaredValue,
      weight,
      length
    }).then(e=>{
      const{data, success, errorCode} = e.data

      if(!success && errorCode){
        this.handleErrorNotification(errorCode)
        return;
      }
      
      if(success && data){
        const shippingCost = {...details.shippingCost, ...{value:parseFloat(data.price).toFixed(2)}}
        const packageInsurance = {
          ...details.packageInsurance,
          ...{ value: parseFloat(data.declaredRate).toFixed(2) },
        };
        this.setState({details:{...details, ...{shippingCost, packageInsurance}}})
        return;
      }else{
        notification['error']({
          message: "Matrix Error",
          description: "No Matrix found",
        });
      }
       
    })
  }

  render() {
    const { width } = this.state;
    return (
      <Layout className="create-parcelview-parent-container">
        <Header className="home-header-view" style={{ padding: 0 }}>
          <div style={{ float: "left" }}>
            <Button type="link" onClick={() => this.props.history.push('/')}>
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
