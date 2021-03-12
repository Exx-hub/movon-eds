import React, { useState } from "react";
import "./create.scss";
import {CreateForm} from "../../component/createParcelForm";
import StepsView from "../../component/steps";
import WebCam from "../../component/webcam";
import ScheduledTrips from "../../component/scheduledTrips";
import ReviewDetails from "../../component/reviewDetails";
import TicketView from "../../component/ticketView";
import { Button, notification, Layout, Checkbox, Input, Form, Space, Divider } from "antd";
import ReactToPrint from "react-to-print";
import { UserOutlined } from "@ant-design/icons";
import ParcelService from "../../service/Parcel";
import MatrixService from "../../service/Matrix";
import ManifestService from "../../service/Manifest";
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath,
  getHeaderColor,
  getHeaderLogo,
  getCashierTextColor
} from "../../utility";

import {CustomModal} from '../../component/modal'
import { config } from "../../config";
import { convertToObject } from "typescript";
import { NavLink } from "react-router-dom";

const { Content, Sider, Header } = Layout;

const MIN_WIDTH = 800;
const STEPS_LIST = [
  {
    title: "Parcel Image",
    description: "Take image of the parcel",
  },
  {
    title: "Parcel Details",
    description: "Fill up parcel information",
  },
  {
    title: "Select Trip",
    description: "Choose from available trips",
  },
  {
    title: "Validation",
    description: "Check your data",
  },
  {
    title: "Print",
    description: "Print QR stickers",
  },
];

const isNull = (value) => value === null || value === undefined || value === "" || value === 0;

const showNotification = (props) => {
  notification[props.type]({
    message: props.title || "Notification Title",
    description: props.message || "message",
  });
};

const StepControllerView = (props) => {
  return (
    <div
      className={[
        `step-controller-container-item ${props.width < 500 ? "button-steps" : ""
        }`,
      ]}
    >
      {!props.disablePreviousButton && (
        <Button
          className="create-btn btn-prev"
          style={{ display: `${props.display}`}} 
          onClick={() => {
            props.onPreviousStep();
          }}
        >
          {props.previousButtonName || "Previous"}
        </Button>
      )}
      {!props.disableNextButton && (
        <Button
          disabled={props.disabled}
          className={`${props.disabled ? "create-btn disabled-btn" : "create-btn btn-next"
            }`}
          onClick={() => {
            props.onNextStep();
          }}
        >
          {props.nextButtonName || "Next"}
        </Button>
      )}
    </div>
  );
};

const getReviewDetails = (state) => {

  const destination = {...state.details.destination}

  const option = destination.options.find(e=>e.endStation === destination.value)

  return {
    packageName: state.details.description.value,
    packageWeight: state.details.packageWeight.value,
    packageQty: state.details.quantity.value,
    packageImages: [state.packageImagePreview],
    recipientName: state.details.receiverName.value,
    recipientEmail: state.details.receiverEmail.value,
    recipientPhone: state.details.receiverMobile.value,
    senderName: state.details.senderName.value,
    senderEmail: state.details.senderEmail.value,
    senderPhone: state.details.senderMobile.value,
    
    totalPrice: state.details.totalShippingCost.value || 0,
    additionalNote: state.details.additionNote.value,
    billOfLading: state.details.billOfLading.value,
    checkIn: state.checkIn,
    destination: option.name || 0,
    length: state.details.length.value || 0,
    stickerCount: state.details.sticker_quantity.value || 0,
    declaredValue: state.details.declaredValue.value || 0,
    price: state.basePrice || 0,

    convenienceFee: state.details.systemFee.value || 0,
    lengthFee: state.lengthFee || 0,
    portersFee: state.portersFee || 0,
    weightFee: state.weightFee || 0,
    handlingFee: state.handlingFee || 0,
    declaredValueFee: state.declaredValueFee,
    insuranceFee: state.insuranceFee || 0,
    additionalFee: state.details.additionalFee.value || 0,
    discountFee: state.discountFee || 0,
    basePrice: state.basePrice || 0,
    cashier:UserProfile.getPersonFullName(),
    type:'create'
  };
};

const parceResponseData = (data) => {
  const userProfile = UserProfile;
  const logo =
    (userProfile.getBusCompany() && userProfile.getBusCompany().logo) ||
    undefined;
  const name = userProfile.getBusCompany() && userProfile.getBusCompany().name;
  const noOfSticker = userProfile.getStickerCount() || 1;

  const endStationName = data.trips
    ? data.trips.endStationName
    : data.endStation.name;
  const startStationName = data.trips
    ? data.trips.startStationName
    : data.startStation.name;
  return {
    noOfSticker,
    packageName: data.packageInfo.packageName,
    packageWeight: data.packageInfo.packageWeight,
    packageQty: data.packageInfo.quantity,
    packageImages: data.packageInfo.packageImages,
    recipientName: data.recipientInfo.recipientName,
    recipientEmail: data.recipientInfo.recipientEmail,
    recipientPhone: "+63" + data.recipientInfo.recipientPhone.number,
    senderName: data.senderInfo.senderName,
    senderEmail: data.senderInfo.senderEmail,
    senderPhone: "+63" + data.senderInfo.senderPhone.number,
    convenienceFee: data.priceDetails.convenienceFee,
    insuranceFee: data.priceDetails.insuranceFee,
    price: data.priceDetails.price,
    totalPrice: data.priceDetails.totalPrice,
    additionalNote: data.additionalNote,
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
    cashier: data.deliveryPersonInfo.deliveryPersonName,
  };
};

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

      details: {
        billOfLading: {
          name: "billOfLading",
          value: undefined,
          isRequired: true,
          accepted: true,
          errorMessage: "Bill of Lading is required!"
        },
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
        receiverName: {
          name: "receiverName",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        receiverMobile: {
          name: "receiverMobile",
          value: undefined,
          isRequired: true,
          accepted: true,
        },
        receiverEmail: {
          name: "receiverEmail",
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
        connectingCompany: {
          name: "connectingCompany",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
        },
        connectingRoutes: {
          name: "connectingRoutes",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
        },
        associateORNumber: {
          name: "associateORNumber",
          value: undefined,
          isRequired: false,
          accepted: true,
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
          value: 1,
          isRequired: false,
          accepted: true,
          disabled: true,
        },
        sticker_quantity: {
          name: "sticker_quantity",
          value: 0,
          isRequired: true,
          accepted: true,
        },
        systemFee: {
          name: "systemFee",
          value: 0,
          isRequired: false,
          accepted: true,
          disabled: true,
        },
        additionNote: {
          name: "additionNote",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        packageInsurance: {
          name: "packageInsurance",
          value: 0,
          isRequired: false,
          accepted: true,
          title: "",
          placeholder: "Declared Value Rate",
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
              disabled: true,
            },
            {
              value: 2,
              name: "Excess Non AC",
              disabled: true,
            },
            {
              value: 3,
              name: "Cargo Padala",
              disabled: false,
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
          disabled: true,
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
          value: 0,
          isRequired: false,
          accepted: true,
          errorMessage: "Length is required!"
        },
        fixMatrix: {
          name: "fixMatrix",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
        },
        busNumber: {
          name: "busNumber",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        tripCode: {
          name: "tripCode",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        driverFullName: {
          name: "driverFullName",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        conductorFullName: {
          name: "conductorFullName",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        discount: {
          name: "discount",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
        },
        associateFixPrice: {
          name: "associateFixPrice",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
        },
        additionalFee: {
          name: "additionalFee",
          value: 0,
          isRequired: false,
          accepted: true,
          enabled: false
        }
      },
      enalbeBicolIsarogWays: false,
      declaredValueadditionalFee: 0.1,
      noOfStickerCopy: 2,
      connectingCompanyComputation: 0,
      tariffRate: undefined,
      lengthFee: Number(0).toFixed(2),
      portersFee: Number(0).toFixed(2),
      weightFee: Number(0).toFixed(2),
      handlingFee: Number(0).toFixed(2),
      isShortHaul: undefined,
      basePrice: Number(0).toFixed(2),
      declaredValueFee: Number(0).toFixed(2),
      insuranceFee: Number(0).toFixed(2),
      isFixedPrice: false,
      discountFee: Number(0).toFixed(2),
      stopStep:false,
      createModal:{
        visible:false,
        data:{},
        title:"Bill of Lading Exist!"
      }
    };
    this.userProfileObject = UserProfile;
    this.fixPriceComputation = debounce(this.fixPriceComputation, 500)
    this.printEl = React.createRef();
    
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateValue);
  }

  componentDidMount() {
    let { details } = { ...this.state };
    ParcelService.getConnectingBusPartners().then((e) => {
      const { success, data, errorCode } = e.data;
      if (success) {
        if (data) {
          const connectingCompany = { ...details.connectingCompany };
          connectingCompany.options = [
            ...data.connectingRoutes,
            ...[{ name: "None", _id: "none" }],
          ];
          //connectingCompany.value = data.connectingRoutes[0]._id
          this.setState({
            details: { ...this.state.details, ...{ connectingCompany } },
          });
        }
      } else {
        this.handleErrorNotification(errorCode);
      }
    });

    let discount = { ...details.discount };
    discount.options = [
      ...this.userProfileObject.getBusCompanyDiscount(),
      ...[{ name: "None", rate: "None" }],
    ];
    details.discount = discount;

    switch (UserProfile.getBusCompanyTag()) {
      case "dltb":
        details.length.disabled = true
        details.length.isRequired = false
        details.discount.disabled = true
        break;

      case "isarog-liner":
        details.billOfLading.disabled = true
        details.length.required = false;
        break;
    
      default:
        break;
    }

    this.setState({
      enalbeBicolIsarogWays: this.userProfileObject.isIsarogLiners(),
      noOfStickerCopy: this.userProfileObject.getStickerCount(),
      details,
    });

    ManifestService.getRoutes()
      .then((e) => {
        const { data, success, errorCode } = e.data;
        if (!errorCode) {
          if (data) {
            const details = { ...this.state.details };
            let _myOption = [];

            data.forEach((e) => {
              if (this.userProfileObject.getAssignedStationId() !== e.end) {
                _myOption.push({
                  name: e.endStationName,
                  value: e.end,
                  startStationId: e.start,
                  startStationName: e.startStationName,
                  endStation: e.end,
                });
              }
            });

            let clean = [];
            _myOption = _myOption.filter((e) => {
              if (!clean.includes(e.value)) {
                clean.push(e.value);
                return true;
              }
              return false;
            });

            const destination = {
              ...details.destination,
              ...{ options: _myOption },
            };
            this.setState({ details: { ...details, ...{ destination } } });
          }
        } else {
          this.handleErrorNotification(errorCode);
        }
      })
      .catch(e => console.info('error', e))
      ;
  }

  handleErrorNotification = (code) => {
    if (isNull(code)) {
      showNotification({
        title: "Server Error",
        type: "error",
        message: "Something went wrong",
      });
      return;
    }

    if (code === 1000) {
      openNotificationWithIcon("error", code);
      this.userProfileObject.clearData();
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

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

  createParcel = () => {
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
        this.setState({ stopStep:true, createParcelResponseData: data }, () =>
          this.gotoNextStep()
        );
      } else {
        if(Number(errorCode) === 4012){
          let createModal = {...this.state.createModal}
          createModal.visible=true;
          this.setState({createModal})
        }else{
          this.handleErrorNotification(errorCode);
        }
      }
    });
  };

  isRequiredDetailsHasNull = () => {
    let hasError = false;
    let _details = { ...this.state.details };

    for (let i = 0; i < Object.keys(_details).length; i++) {
      let name = Object.keys(_details)[i];
      if (!_details[name].disabled && _details[name].isRequired && isNull(_details[name].value)) {
        hasError = true;
        break;
      }
      if (!_details[name].accepted) {
        hasError = true;
        break;
      }
    }
    return hasError;
  };

  onBlurValidation = (name) => {
    let details = { ...this.state.details };

    if (isNull(details[name].value)) {
      return null;
    }

    if (
      !isNull(details[name].value) &&
      (name === "senderEmail" || name === "receiverEmail")
    ) {
      // eslint-disable-next-line
      const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        details[name].value
      );
      return {
        ...details[name],
        ...{
          hasError: !validEmail,
          accepted: validEmail,
          errorMessage: validEmail ? "" : "Invalid Email!",
        },
      };
    }

    if (
      !isNull(details[name].value) &&
      (name === "senderMobile" || name === "receiverMobile")
    ) {
      const validNumber = /^\d+$/.test(details[name].value);
      const isValid = validNumber && details[name].value.length === 10;
      return {
        ...details[name],
        ...{
          accepted: isValid,
          errorMessage: "Invalid phone number!",
        },
      };
    }

    if (
      //name === "senderName" ||
      //name === "receiverName" ||
      name === "driverFullName" ||
      name === "conductorFullName"
    ) {
      let isValid = true;
      if (details[name].value) {
        const fullName = details[name].value.trim().split(" ");
        isValid = fullName.length > 1;

        if (isValid) {
          for (let i = 0; i < fullName.length; i++) {
            const validString = /^[A-Za-z]+$/.test(fullName[i]);
            if (!validString) {
              isValid = false;
              break;
            }
          }
        }
      }

      return {
        ...details[name],
        ...{
          accepted: isValid,
          hasError: !isValid,
          errorMessage: !isValid ? "Invalid name!" : "",
        },
      };
    }

    if (
      name === "declaredValue" ||
      name === "length" ||
      name === "quantity" ||
      name === "packageWeight" ||
      name === "sticker_quantity"
    ) {
      const isValid = Number(details[name].value) > -1;
      return {
        ...details[name],
        ...{
          accepted: isValid,
          errorMessage: isValid ? "" : "Invalid number!",
        },
      };
    }

    if (name === "quantity") {
      let value = (details[name].value && Math.floor(details[name].value)) || 0;
      return {
        ...details[name],
        ...{ value },
      };
    }

    return null;
  };

  validateStep = () => {
    let {
      currentStep,
      verifiedSteps,
      details,
      packageImagePreview,
      selectedTrip,
    } = this.state;

    if (verifiedSteps >= 4) {
      console.log("already created.. no more modification");
      this.setState({stopStep:true})
      return false;
    }

    if (currentStep === 0) {
      if (isNull(packageImagePreview)) {
        showNotification({
          title: "Parcel Image Validation",
          type: "error",
          message: "Please take photo and continue",
        });
        return false;
      }
    }

    if (currentStep === 1) {
      if (this.isRequiredDetailsHasNull()) {
        showNotification({
          title: "Parcel Details Validation",
          type: "error",
          message: "Please fill up required fields",
        });

        let tempDetails = { ...details };
        Object.keys(tempDetails).forEach((e) => {
          if (!tempDetails[e].disabled && tempDetails[e].isRequired && isNull(tempDetails[e].value)) {
            const item = { ...tempDetails[e], ...{ accepted: false } };
            tempDetails = { ...tempDetails, ...{ [e]: item } };
          }
        });
        this.setState({ details: tempDetails });
        return false;
      } else {
        let hasError = false;
        let tempDetails = { ...details };
        Object.keys(tempDetails).forEach((e) => {
          let item = this.onBlurValidation(e);
          if (item) {
            hasError = true;
            tempDetails = { ...tempDetails, ...{ [e]: item } };
          }
        });
        this.setState({ details: tempDetails });
        return hasError;
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
      if (this.isRequiredDetailsHasNull()) {
        showNotification({
          title: "Create Parcel Validation",
          type: "error",
          message: "Please fill up required fields",
        });
        return false;
      }
    }

    return true;
  };

  // getConvinienceFee = (qty, declaredValue) => {
  //   if (Boolean(this.userProfileObject.isIsarogLiners())) {
  //     ParcelService.getConvenienceFee(qty, declaredValue).then((res) => {
  //       this.parseSystemFeeResponse(res);
  //     });
  //     return;
  //   }

  //   // if (!qty) {
  //   //   let details = { ...this.state.details };
  //   //   let systemFee = { ...details.systemFee };
  //   //   systemFee.value = 0;
  //   //   details.systemFee = systemFee;
  //   //   this.setState({ details });
  //   //   return;
  //   // }

  //   if (this.userProfileObject.isFiveStar()) {
  //     ParcelService.getFiveStarConvenienceFee(qty, 0).then((res) => this.parseSystemFeeResponse(res));
  //     return;
  //   }
  // };

  // parseSystemFeeResponse = (res) => {
  //   const { success, data, errorCode } = res.data;
  //   if (!success) {
  //     this.handleErrorNotification(errorCode);
  //   }
  //   let details = { ...this.state.details };
  //   let systemFee = { ...this.state.details.systemFee };
  //   systemFee = Object.assign({}, systemFee, { value: data.convenienceFee });
  //   this.setState({ details: Object.assign(details, { systemFee }) }, () =>
  //     this.updateTotalShippingCost()
  //   );
  // };

  // computePrice = (callback) => {
  //   if (
  //     this.state.details.fixMatrix.value &&
  //     this.state.details.fixMatrix.value !== "none"
  //   ) {
  //     return;
  //   }

  //   const { destination, declaredValue, paxs, packageWeight, type, length } = this.state.details;

  //   const busCompanyId = this.userProfileObject.getBusCompanyId();
  //   const startStation = this.userProfileObject.getAssignedStationId();
  //   const selectedOption = destination.options.filter((e) => e.value === destination.value)[0];
  //   const endStation = selectedOption.endStation || undefined;
  //   const parcel_length = length.value || 0;
  //   const weight = packageWeight.value ? parseFloat(packageWeight.value).toFixed(2) : undefined;
  //   const pax = paxs.value || 0;
  //   let decValue =  Number(declaredValue.value || 0) 

  //   if((Number(type.value) === 3)){
  //     if (isNull(busCompanyId) || isNull(startStation) || isNull(endStation) || isNull(weight) || isNull(decValue)) {
  //       return
  //     }
  //   }else{
  //     if (isNull(busCompanyId) || isNull(startStation) || isNull(endStation) || isNull(weight)) {
  //       return
  //     }
  //   }

  //   ParcelService.getDynamicPrice(
  //     busCompanyId,
  //     decValue,
  //     endStation,
  //     type.value,
  //     pax,
  //     startStation,
  //     weight,
  //     parcel_length
  //   )
  //     .then((e) => {
  //       const { data, success, errorCode } = e.data;
  //       if (errorCode) {
  //         this.handleErrorNotification(errorCode);
  //         return;
  //       }
  //       callback(data);
  //     });

  // }

  fixPriceComputation = () => {
    let d = { ...this.state.details }
    const options = {
      origin: UserProfile.getAssignedStationId(),
      destination: d.destination.value,
      declaredValue: d.declaredValue.value || 0,
      parcelCount: d.sticker_quantity.value,
      fixMatrixItemName: d.fixMatrix.value,
      quantity: d.quantity.value,
      additionalFee: d.additionalFee.value,
      discountName : (d.discount.value && d.discount.value.toLowerCase()) || 'none'
    }
    ParcelService.getDefaultFixMatrixComputation(options)
      .then(e => {
        const { data, errorCode } = e.data;
        console.info('getDefaultFixMatrixComputation',e)
        if (!errorCode) {

          const {
            declaredValueFee,
            systemFee,
            basePrice,
            portersFee,
            additionalFee,
            discountFee,
            computeTotalShippingCost
          } = data

          d.totalShippingCost.value = computeTotalShippingCost;
          d.systemFee.value = systemFee;

          this.setState({
            discountFee,
            declaredValueFee,
            isFixedPrice: true,
            basePrice,
            details: d,
            portersFee,
            additionalFee
          })
        } else {
          this.handleErrorNotification(errorCode);
        }
      })
  }

  // addFixMatrixFee = (_qty, addrate) => {
  //   let d = { ...this.state.details }
  //   let total = (Number(d.packageInsurance.value || 0) + Number(d.shippingCost.value || 0))
  //   let qty = Number(_qty || 0)
  //   let quantity = qty < 1 ? 1 : qty;
  //   total = total * quantity;
  //   total += Number(d.systemFee.value || 0)
  //   total += addrate
  //   d.totalShippingCost.value = total
  //   return total;
  // }

  onInputChange = (name, value) => {
    let details = { ...this.state.details };
    let state = {...this.state}

    let item = {
      ...details[name],
      ...{ value, accepted: true, hasError: false },
    };

    this.setState({...state, details: { ...details, ...{ [name]: item } } }, () => {

      
      switch (UserProfile.getBusCompanyTag()) {
        case "isarog-liner": 
        case "five-star":
        case "dltb":
          if (details.fixMatrix.value && details.fixMatrix.value.toLowerCase() !== 'none') {
            if( name === "additionalFee" || name ==="quantity" ||  name === 'declaredValue' || name === "sticker_quantity") {
              this.fixPriceComputation()
              return;
            }
          }

          if (name === 'declaredValue' || name == 'sticker_quantity' || name == 'length' || name === 'packageWeight') {
            this.computeV2()
          }
          break

        default:
          break;
      }
    });
  };

  getMatrixValue = (busCompanyId, origin, destination) => {
    return MatrixService.getMatrix({
      busCompanyId,
      origin,
      destination,
    }).then((res) => {
      const { data, errorCode } = res.data;
      if (errorCode) {
        this.handleErrorNotification(errorCode);
        return Promise.reject();
      }
      const stringValues =
        (data.stringValues && JSON.parse(data.stringValues)) || [];
      return Promise.resolve(stringValues);
    });
  };

  computeWithoutDeclareValue = (associatedDestination) => {
    let details = { ...this.state.details };
    const fixMatrixPrice = details.fixMatrix.options.find(
      (e) => e.name === details.fixMatrix.value
    );

    const origin = details.connectingRoutes.options.filter((e) => e.end)[0]
      .start;
    const destination = associatedDestination;
    const associateId = details.connectingCompany.value;
    const weight = 1;
    const declaredValue = fixMatrixPrice.price;

    MatrixService.onConnectingRoutesComputation(
      associateId,
      origin,
      destination,
      weight,
      declaredValue
    ).then((e) => {
      const { data, success, errorCode } = e.data;
      if (errorCode) {
        this.setState(
          { connectingCompanyComputation: 0, tariffRate: 0 },
          () => {
            this.handleErrorNotification(errorCode);
          }
        );
      } else {
        if (success) {
          if (data) {
            this.setState(
              {
                connectingCompanyComputation: data.total,
                tariffRate: e.tariffRate,
              }
            );
          }
        }
      }
    });
  };

  onSelectChange = async (value, name) => {
    let details = { ...this.state.details };
    let state = {...this.state}

    if (name === "connectingCompany") {
      if (value.toLowerCase() === "none") {
        const associateFixPrice = details.associateFixPrice;
        associateFixPrice.value = undefined;
        associateFixPrice.options = [];

        const connectingRoutes = details.connectingRoutes;
        connectingRoutes.value = undefined;
        connectingRoutes.options = [];

        const connectingCompany = details.connectingCompany;
        connectingCompany.value = value;

        details.connectingRoutes = connectingRoutes;
        details.associateFixPrice = associateFixPrice;
        details.connectingCompany = connectingCompany;

        this.setState({ details, connectingCompanyComputation: 0 });
        return;
      }

      ParcelService.getConnectingRoutes(value).then((e) => {
        const { data, success, errorCode } = e.data;
        if (!success) this.handleErrorNotification(errorCode);
        else {
          const connectingRoutes = { ...details.connectingRoutes };
          connectingRoutes.options = data.map((e) => ({
            start: e.start,
            end: e.end,
            endStationName: e.endStationName,
          }));
          this.setState({
            details: { ...this.state.details, ...{ connectingRoutes } },
          });
        }
      });

      const connectingCompany = {
        ...details.connectingCompany,
        ...{ value, accepted: true },
      };

      details = { ...details, ...{ connectingCompany } };
      this.setState({ details });
    }

    if (name === "connectingRoutes") {

      const associateFixPrice = { ...details.associateFixPrice };
      associateFixPrice.value = undefined;
      associateFixPrice.options = [];
      //details.associateFixPrice = associateFixPrice;

      const connectingRoutes = {
        ...details.connectingRoutes,
        ...{ value, accepted: true },
      };

      details = { ...details, ...{ connectingRoutes, associateFixPrice } };

      this.getMatrixValue(
        this.state.details.connectingCompany.value,
        this.state.details.connectingRoutes.options.filter((e) => e.end)[0]
          .start,
        value
      ).then((e) => {
        let details = { ...this.state.details };
        let associateFixPrice = { ...details.associateFixPrice };
        associateFixPrice.options = [
          ...e.fixMatrix,
          ...[{ name: "None", price: undefined }],
        ];
        details.associateFixPrice = associateFixPrice;
        this.setState({ details });
      });

      if (
        details.fixMatrix.value &&
        details.fixMatrix.value.toLowerCase() !== "none"
      ) {
        this.computeWithoutDeclareValue(value);
      }

      this.setState({ details });
    }

    if (name === "destination") {
      const selectedDestination = details.destination.options.filter(
        (e) => e.value === value
      )[0];

      let destination = {
        ...details.destination,
        ...{ value, accepted: true },
      };

      let fixMatrix = { ...details.fixMatrix }
      fixMatrix.value = undefined;
      fixMatrix.options = []
      details.fixMatrix = fixMatrix;

      details.discount.value = undefined;

      let description = { ...details.description }
      description.value = undefined;
      details.description = description;

      details = { ...details, ...{ destination } };

      let state = {
        ...this.state,
        lengthFee: Number(0).toFixed(2),
        portersFee: Number(0).toFixed(2),
        weightFee: Number(0).toFixed(2),
        handlingFee: Number(0).toFixed(2),
        isShortHaul: undefined,
        isFixedPrice: false,
        basePrice: Number(0).toFixed(2),
        declaredValueFee: Number(0).toFixed(2),
        insuranceFee: Number(0).toFixed(2),
        lengthRate: Number(0).toFixed(2),
        discountFee: Number(0).toFixed(2),
      }
      this.setState({ ...state, details, selectedDestination });


      MatrixService.getMatrix({
        busCompanyId: this.userProfileObject.getBusCompanyId(),
        origin: this.userProfileObject.getAssignedStationId(),
        destination: value,
      }).then((e) => {
        const { data, success, errorCode } = e.data;
        if (success) {
          let result = (data &&
            data.stringValues &&
            JSON.parse(data.stringValues)) || { matrix: [], fixMatrix: [] };
          let details = { ...this.state.details };

          if (!result.fixMatrix) {
            result.fixMatrix = []
          }

          if (Array.isArray(result)) {
            details.fixMatrix = {
              ...details.fixMatrix,
              ...{
                options: [
                  ...[{ name: "none", price: 0, declaredValue: 0 }],
                  ...result,
                ],
              },
            };
            this.setState({ details });
          } else {
            details.fixMatrix = {
              ...details.fixMatrix,
              ...{
                options: [
                  ...[{ name: "none", price: 0, declaredValue: 0 }],
                  ...result.fixMatrix,
                ],
              },
            };
            this.setState({ details }, () => {
              switch (UserProfile.getBusCompanyTag()) {
                //case 'isarog-liner':
                  //this.updateTotalShippingCost()
                //break;
                default:
                  this.computeV2();
                break;
              }
             
            });
          }
        } else {
          this.handleErrorNotification(errorCode);
        }
      });
    }

    if (name === "discount") {
     
      let additionNote = { ...details.additionNote };
      additionNote.value = value.toLowerCase() === "none" ? undefined : value
      additionNote.accepted = true;

      let discount = { ...details.discount };
      discount.value = value;
      discount.accepted = true;

      details.discount = discount;
      details.additionNote = additionNote;

      this.setState({ ...state, details },()=>{
        if(details.fixMatrix.value === undefined || details.fixMatrix.value.toLowerCase() === 'none'){
          this.requestComputation()
        }else{
          this.fixPriceComputation()
        }
      });
      return;
    }

    if (name === "associateFixPrice") {
      const associateFixPrice = {
        ...details.associateFixPrice,
        ...{ value, accepted: true },
      };
      const price =
        (associateFixPrice.options.length > 0 &&
          associateFixPrice.options.find((e) => e.name === value).price) ||
        0;
      details = { ...details, ...{ associateFixPrice } };
      this.setState(
        { connectingCompanyComputation: Number(price), details },
        () => {
          this.computeForConnectinRoutes();
          //this.updateTotalShippingCost();
        }
      );
    }

    if (name === "fixMatrix") {
      let details = { ...this.state.details };
      details.additionalFee.enabled = false
      details.quantity.value = 1;
      details.additionalFee.value = undefined;
      details.sticker_quantity.value = 0;
      details.totalShippingCost.value = 0
      details.additionNote.value = ""
      details.systemFee.value = 0;
      details.discount.value = undefined;

      details.packageInsurance.value = undefined;
      details.packageInsurance.disabled = false;
      details.declaredValue.value = undefined;
      details.declaredValue.disabled = false;

      let state = {
        ...this.state,
        lengthFee: Number(0).toFixed(2),
        portersFee: Number(0).toFixed(2),
        weightFee: Number(0).toFixed(2),
        handlingFee: Number(0).toFixed(2),
        isShortHaul: undefined,
        isFixedPrice: false,
        basePrice: Number(0).toFixed(2),
        declaredValueFee: Number(0).toFixed(2),
        insuranceFee: Number(0).toFixed(2),
        lengthRate: Number(0).toFixed(2),
        discountFee: Number(0).toFixed(2),
      }

      if (value !== "none") {
        let option = details.fixMatrix.options.find((e) => e.name === value);
        let price = Number(option.price).toFixed(2);
        let declaredValue = Number(option.declaredValue);

        details.additionalFee.enabled = Boolean(option.additionalFee);
        declaredValue = declaredValue / 100;
        details.fixMatrix.value = value;

        if (Number(declaredValue) === Number(0)) {
          details.packageInsurance.disabled = true;
          details.declaredValue.disabled = true;
        }

        details.packageWeight.disabled = true;
        details.packageWeight.value = undefined;
        details.length.disabled = true;
        details.length.value = undefined;
        details.quantity.disabled = false;
        details.quantity.value = 1;
        details.description.value = option.name;

        switch (UserProfile.getBusCompanyTag()) {
          case 'isarog-liner':
          case 'five-star':
            this.setState({ ...state, isFixedPrice: true, details }, () => {
              if (option && Number(option.price) === 0) {
                return;
              }
              this.fixPriceComputation()
            });
            break;
          case "dltb":
            this.setState({ ...state, isFixedPrice: true, details }, () => {
              if (option && Number(option.price) === 0 && Number(option.declaredValue) !== 0) {
                return;
              }
              this.fixPriceComputation()
            });
            break;

          default:
            //this.setState({ ...state, basePrice: price, isFixedPrice: true, details }, () => {
              // if (option && Number(option.declaredValue) > 0) {
              //   return;
              // }
              //this.updateTotalShippingCost();
            //});
            break;
        }
      } else {

        details.fixMatrix.value = "none";
        details.packageInsurance.disabled = false;
        details.declaredValue.disabled = false;
        details.packageWeight.disabled = false;
        details.description.value = "";

        details.packageInsurance.value = undefined;
        details.declaredValue.value = undefined;
        details.shippingCost.value = undefined;
        details.packageWeight.value = undefined;

        if (UserProfile.getBusCompanyTag() !== "dltb") {
          details.length.disabled = false;
        }

        details.length.value = undefined;
        details.quantity.disabled = true;
        details.quantity.value = 1;

        this.setState({ ...state, details });
      }
    }
  };

  onTypeChange = (value) => {
    const details = { ...this.state.details };
    const declaredValue = {...details.declaredValue}
    declaredValue.disabled = Number(value) !== 3;
    declaredValue.value = 0;
    details.declaredValue = declaredValue;

    const type = { ...details.type, ...{ value } }
    details.type = type
   
    this.setState({
      details
    });
  };

  onCreateNewParcel = () => {
    window.location.reload(true);
  };

  stepView = (step) => {
    let view = null;

    switch (step) {
      case 1:

        switch (UserProfile.getBusCompanyTag()) {

          default:
            view = (
              <>
                <CreateForm
                  enableInterConnection={this.state.enalbeBicolIsarogWays}
                  onBlur={(name) => {
                    let item = this.onBlurValidation(name);
                    if (item)
                      this.setState({
                        details: { ...this.state.details, ...{ [name]: item } },
                      });
                  }}
                  lengthRate={this.state.lengthRate}
                  priceDetails={{
                    lengthFee: this.state.lengthFee,
                    portersFee: this.state.portersFee,
                    weightFee: this.state.weightFee,
                    handlingFee: this.state.handlingFee,
                    isShortHaul: this.state.isShortHaul,
                    basePrice: this.state.basePrice,
                    declaredValueFee: this.state.declaredValueFee,
                    insuranceFee: this.state.insuranceFee,
                    isFixedPrice: this.state.isFixedPrice,
                    discountFee: this.state.discountFee
                  }}
                  details={this.state.details}
                  onTypeChange={(e) => this.onTypeChange(e.target.value)}
                  onSelectChange={(value, name) =>
                    this.onSelectChange(value, name)
                  }
                  onChange={(val,name) => 
                    this.onInputChange(name, val)
                  }
                />
                <StepControllerView
                  width={this.state.width}
                  onPreviousStep={() => this.onPreviousStep()}
                  onNextStep={() => {
                    let isValid = this.validateStep();
                    if (isValid) {
                      this.gotoNextStep();
                    }
                  }}
                />
              </>
            )
            break;
        }
        break;
      case 0:
        view = (
          <>
            {/* <div style={{ display:'none', background: '#fff', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
              <img style={{ display:'none', maxHeight: '170px', maxWidth: '250px' }} src={UserProfile.getBusCompanyLogo()} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginTop: '1rem', padding: '1rem' }}>
                <Space direction="vertical">
                  <Space>
                    <div style={{ width: 90, fontSize: "14px", fontWeight: 300 }}>Company</div>
                :&nbsp;<span style={{ width: 80, fontSize: "14px", fontWeight: 300 }}>{UserProfile.getBusCompanyName()}</span>
                  </Space>
                  <Space>
                    <div style={{ width: 90, fontSize: "14px", fontWeight: 300 }}>Full Name</div>
                :&nbsp;<span style={{ width: 80, fontSize: "14px", fontWeight: 300 }}>{UserProfile.getPersonFullName()}</span>
                  </Space>
                  <Space>
                    <div style={{ width: 90, fontSize: "14px", fontWeight: 300 }}>Address</div>
                :&nbsp;<span style={{ width: 80, fontSize: "14px", fontWeight: 300 }}>{UserProfile.getPersonAddress()}</span>
                  </Space>
                </Space>
              </div>
            </div> 
            <Divider />
            */}
            <div style={{marginTop:'3rem'}}>
            <WebCam
              image={
                this.state.packageImagePreview 
              }
              onCapture={(packageImagePreview) =>
                this.setState({ packageImagePreview })
              }
            />
            </div>
            
            <StepControllerView
            display="none"
              width={this.state.width}
              onPreviousStep={() => this.onPreviousStep()}
              onNextStep={() => {
                if (this.validateStep()) {
                  this.gotoNextStep();
                }
              }}
            />
          </>
        );
        break;
      case 2:
        view = (
          <>
            <ScheduledTrips
              onSelect={(selectedTrip) => {
                this.setState({ selectedTrip }, () => {
                  if (this.validateStep()) {
                    this.gotoNextStep();
                  }
                });
              }}
              selectedDestination={this.state.selectedDestination}
              //tripOption={_myOption}
              //tripShedules={data.trips.data}
              endStation={this.state.details.destination.value}
              windowSize={this.state.width}
            />
            <StepControllerView
              width={this.state.width}
              disableNextButton={true}
              onPreviousStep={() => this.onPreviousStep()}
              onNextStep={() => { }}
            />
          </>
        );

        break;
      case 3:
        view = (
          <>
            <ReviewDetails
              onChange={(e) =>
                this.onInputChange(e.target.name, e.target.value)
              }
              value={getReviewDetails(this.state)}
              viewMode={false}
            />
            <div className="center-horizontal-space-between">
              <div style={{ display: "none" }} className="checkbox-container">
                <Checkbox
                  checked={this.state.checkIn}
                  onChange={(e) => this.setState({ checkIn: e.target.checked })}
                >
                  Check In
                </Checkbox>
              </div>
              <StepControllerView
                disabled={this.state.isLoading}
                nextButtonName="Create Parcel"
                enablePreviousButton={true}
                onPreviousStep={() => this.onPreviousStep()}
                onNextStep={() => {
                  if (this.validateStep()) {
                    this.createParcel();
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
              <TicketView
                value={parceResponseData(this.state.createParcelResponseData)}
              />
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
                onClick={() => this.onCreateNewParcel()}
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

  computeForConnectinRoutes = () => {
    const currentDetails = { ...this.state.details };
    if (
      currentDetails.connectingRoutes.value &&
      currentDetails.connectingCompany.value
    ) {
      const origin = currentDetails.connectingRoutes.options.filter(
        (e) => e.end
      )[0].start;
      const destination = currentDetails.connectingRoutes.value;
      const associateId = currentDetails.connectingCompany.value;
      const weight = currentDetails.packageWeight.value;
      const declaredValue = currentDetails.declaredValue.value;
      const associateFixPrice =
        currentDetails.associateFixPrice.value || undefined;

      if (associateFixPrice && associateFixPrice.toLowerCase() !== "none") {
        const { value, options } = currentDetails.associateFixPrice;
        const option = options.find((e) => e.name === value) || undefined;
        let price = option ? option.price : 0;
        this.setState(
          {
            connectingCompanyComputation: Number(price),
            tariffRate: 47.5,
          });
        return;
      }

      if (destination && associateId && origin && weight && declaredValue) {
        MatrixService.onConnectingRoutesComputation(
          associateId,
          origin,
          destination,
          weight,
          declaredValue
        ).then((e) => {
          const { data, success, errorCode } = e.data;
          if (errorCode) {
            this.setState(
              { connectingCompanyComputation: 0, tariffRate: 0 },
              () => {
                this.handleErrorNotification(errorCode);
              }
            );
          } else {
            if (success) {
              if (data) {
                this.setState({
                  connectingCompanyComputation: data.total,
                  tariffRate: e.tariffRate,
                });
              }
            }
          }
        });
      }
    }
  };

  requestComputation = () => {
    const { declaredValue, packageWeight, sticker_quantity, destination, length, discount } = this.state.details;
    const selectedOption = destination.options.filter((e) => e.value === destination.value)[0];
    const endStation = selectedOption.endStation || undefined;
    const startStation = this.userProfileObject.getAssignedStationId();
    const discountName = (discount.value && discount.value.toLowerCase()) || 'none'

    if (!endStation || !startStation)
      return

    const option = {
      origin: startStation,
      destination: endStation,
      declaredValue: Number(declaredValue.value),
      weight: Number(packageWeight.value),
      parcelCount: Number(sticker_quantity.value),
      length: Number(length.value),
      discountName
    }

    ParcelService.getDefaultComputation(option)
      .then(e => {
        const { data, errorCode } = e.data;
        console.info("getDefaultComputation",e)
        if (!errorCode) {
          const {
            totalShippingCost,
            declaredValueFee,
            systemFee,
            handlingFee,
            additionalFee,
            shippingCost,
            weightFee,
            lengthFee,
            basePrice,
            isShortHaul,
            insuranceFee,
            portersFee,
            discountFee
          } = data;

          const _lengthFee = Number(lengthFee || 0)
          const _weightFee = Number(weightFee || 0)
          const _additionFee = Number(additionalFee || 0)
          const _systemFee = Number(systemFee || 0)
          const _declaredValueFee = Number(declaredValueFee || 0)
          let total = Number(totalShippingCost || 0)


          const _shippingCost = Number(shippingCost);
          const _data = { ...this.state.details }

          let quantity = Number(_data.quantity.value || 1)
          quantity = quantity > 0 ? quantity : 1;

          if (quantity > 1) {
            total = shippingCost * quantity
          }

          _data.totalShippingCost.value = total
          _data.packageInsurance.value = _declaredValueFee;
          _data.additionalFee.value = _additionFee;
          _data.systemFee.value = _systemFee;
          _data.shippingCost.value = _shippingCost;

          this.setState({
            discountFee,
            portersFee,
            insuranceFee,
            declaredValueFee,
            handlingFee,
            lengthFee: _lengthFee.toFixed(2),
            weightFee:_weightFee.toFixed(2),
            details: _data,
            basePrice,
            isShortHaul: Boolean(isShortHaul),
            isFixedPrice: false
          });
        }
      })
  }

  computeV2 = () => {
    const { declaredValue, packageWeight, sticker_quantity, length, destination, fixMatrix } = this.state.details;

    switch (UserProfile.getBusCompanyTag()) {
      case "dltb":
        if (destination.value && declaredValue.value && packageWeight.value && sticker_quantity.value) {
          this.requestComputation()
        }
        break;

        case "five-star":
        case "isarog-liner":
        if (!fixMatrix.value || fixMatrix.value === "none") {
          if (destination.value && declaredValue.value && packageWeight.value && sticker_quantity.value && length.value !== undefined) {
            this.requestComputation()
          }
        } else {
          this.fixPriceComputation()
        }
        break;

      default:
        break;
    }
  }

  getMatrixFare = ({ weight, declaredValue, length }) => {
    const { details, selectedDestination } = this.state;
    MatrixService.getMatrixComputation({
      origin: this.userProfileObject.getAssignedStationId(),
      destination: selectedDestination.value,
      declaredValue,
      weight,
      length,
    }).then((e) => {
      const { data, success, errorCode } = e.data;

      if (!success && errorCode) {
        this.handleErrorNotification(errorCode);
        return;
      }

      if (success && data) {
        const shippingCost = {
          ...details.shippingCost,
          ...{ value: parseFloat(data.price).toFixed(2) },
        };
        const packageInsurance = {
          ...details.packageInsurance,
          ...{ value: parseFloat(data.declaredRate).toFixed(2) },
        };
        this.setState({
          details: { ...details, ...{ shippingCost, packageInsurance } },
        });
        return;
      } else {
        notification["error"]({
          message: "Matrix Error",
          description: "No Matrix found",
        });
      }
    });
  };

  render() {
    return (
      <Layout className="create-parcelview-parent-container" style={{ background: 'white' }}>
        {<Header className="home-header-view" style={{ background: getHeaderColor(),  padding: 0 }}>
          <div style={{ width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
           <NavLink to="/"><img src={getHeaderLogo()} style={{height:'120px'}} /></NavLink>
           <div style={{color: getCashierTextColor(), marginRight:'2rem'}}>
            <span style={{fontWeight:'bold', fontSize:'14px', marginRight:'0.3rem'}}>{ UserProfile.getPersonFullName()} </span>
            <span style={{ fontSize:'14px'}}><UserOutlined style={{ fontSize: "24px" }} /></span>
           </div>
          </div>
        </Header>}
        <Layout>
          <Sider width={200} className="create-side-bar">
            <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
              <StepsView
                disabled={this.state.stopStep}
                stepList={STEPS_LIST}
                current={this.state.currentStep}
                onchange={(s) => this.updateSteps(s)}
                direction="vertical"
              />
            </div>
          </Sider>
          <Content>
            <div className="create-content-container">
              {this.stepView(this.state.currentStep)}
            </div>
          </Content>
        </Layout>

        <CustomModal 
          width={500} 
          visible={this.state.createModal.visible} 
          title={this.state.createModal.title}>

          <section className="bill-of-lading-modal-section">
          <p className="message">
            You have entered an existing bill of lading.
            Please replace it and continue.
          </p>

          <Form 
            onFinish={(value)=>{
              let details = {...this.state.details}
              let billOfLading = {...details.billOfLading};
               billOfLading.value = value.billOfLading;
               billOfLading.accepted = true;
               details.billOfLading = billOfLading;

               let createModal ={ ...this.state.createModal}
               createModal.visible = false;

               this.setState({details, createModal},()=>{
                this.createParcel()
               });
            }}
            name="modal-form">
            <section className="input-section">
              <Form.Item 
                name="billOfLading"
                label="Bill of Lading"
                rules={[{ required: true, message: 'Bill of lading is required field' }, 
                ((field)=>({
                  validator(rule, value){
                    if(value && value.trim().indexOf(' ') > -1){
                      return Promise.reject('White space is not allowed!');
                    }
                    return Promise.resolve()
                  }
                }))]}>
                  <Input 
                    size="large" 
                    placeholder="Bill of Lading"/>
              </Form.Item>
            </section>
          <section className='button-section'>
              <Button 
                onClick={()=>{
                  let createModal = {...this.state.createModal};
                  createModal.visible = false;
                  this.setState({createModal})
                }}
                shape="round" 
                className="button-cancel">Cancel</Button>
              <Button 
                htmlType="submit"
                shape="round" 
                className="button-update">Validate</Button>
          </section>

          </Form>
            
          </section>
        </CustomModal>
      </Layout>
    );
  }
}

export default CreateParcel;
