import React, { useState } from "react";
import "./create.scss";
import {
  BicolIsarogForm,
  CreateParcelForm,
} from "../../component/createParcelForm";
import StepsView from "../../component/steps";
import WebCam from "../../component/webcam";
import ScheduledTrips from "../../component/scheduledTrips";
import ReviewDetails from "../../component/reviewDetails";
import TicketView from "../../component/ticketView";
import { Button, notification, Layout, Checkbox, Input, Form, Space } from "antd";
import ReactToPrint from "react-to-print";
import { ArrowLeftOutlined, CodeOutlined, NumberOutlined } from "@ant-design/icons";
import ParcelService from "../../service/Parcel";
import MatrixService from "../../service/Matrix";
import ManifestService from "../../service/Manifest";
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath
} from "../../utility";

const { Content, Sider, Header } = Layout;
const { TextArea } = Input;

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

const isNull = (value) => value === null || value === undefined || value === "";

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
    convenienceFee: state.details.systemFee.value,
    insuranceFee: state.details.packageInsurance.value,
    price: state.details.shippingCost.value,
    totalPrice: state.details.totalShippingCost.value,
    additionalNote: state.details.additionNote.value,
    billOfLading: state.billOfLading.value,
    checkIn: state.checkIn,
    destination: state.details.destination.value,
    lengthFee: "test",
    length: state.details.length.value,
    weightFee: state.priceDetails.weightFee,
    portersFee: state.priceDetails.portersFee,
    stickerCount: state.stickerCount.value,
    declaredValue: state.details.declaredValue.value,
    additionalFee: 'test'
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
  };
};

class CreateParcel extends React.Component {
  constructor() {
    super();
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
          errorMessage:"Bill of Lading is required!"
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
          value: 0,
          isRequired: true,
          accepted: true,
          disabled: true,
        },
        sticker_quantity: {
          name: "sticker_quantity",
          value: undefined,
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
          value: undefined,
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
          isRequired: true,
          accepted: true,
          disabled: false,
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
          value: undefined,
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
      lengthRate: 0,
    };
    this.userProfileObject = UserProfile;
    this.dltbFixPriceComputation = debounce(this.dltbFixPriceComputation, 500)
    this.printEl = React.createRef();

    window.addEventListener("resize", (e) => {
      this.setState({
        height: e.currentTarget.innerHeight,
        width: e.currentTarget.innerWidth,
      });
    });
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

    if (UserProfile.getBusCompanyTag() === 'dltb') {
      details.length.disabled = true
    }

    this.setState({
      enalbeBicolIsarogWays: this.userProfileObject.isIsarogLiners(),
      noOfStickerCopy: this.userProfileObject.getStickerCount(),
      details,
    });

    ManifestService.getRoutes().then((e) => {
      const { data, success, errorCode } = e.data;
      console.info('data',data)
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
    });
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
        this.setState({ createParcelResponseData: data }, () =>
          this.gotoNextStep()
        );
      } else {
        this.handleErrorNotification(errorCode);
      }
    });
  };

  isRequiredDetailsHasNull = () => {
    let hasError = false;
    let _details = { ...this.state.details };

    for (let i = 0; i < Object.keys(_details).length; i++) {
      let name = Object.keys(_details)[i];
      if (_details[name].isRequired && isNull(_details[name].value)) {
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
      billOfLading,
    } = this.state;

    if (verifiedSteps >= 4) {
      console.log("already created.. no more modification");
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
          if (tempDetails[e].isRequired && isNull(tempDetails[e].value)) {
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

  getConvinienceFee = (qty, declaredValue) => {
    if (Boolean(this.userProfileObject.isIsarogLiners())) {
      ParcelService.getConvenienceFee(qty, declaredValue).then((res) => {
        this.parseSystemFeeResponse(res);
      });
      return;
    }

    // if (!qty) {
    //   let details = { ...this.state.details };
    //   let systemFee = { ...details.systemFee };
    //   systemFee.value = 0;
    //   details.systemFee = systemFee;
    //   this.setState({ details });
    //   return;
    // }

    if (this.userProfileObject.isFiveStar()) {
      ParcelService.getFiveStarConvenienceFee(qty, 0).then((res) => this.parseSystemFeeResponse(res));
      return;
    }
  };

  parseSystemFeeResponse = (res) => {
    const { success, data, errorCode } = res.data;
    if (!success) {
      this.handleErrorNotification(errorCode);
    }
    let details = { ...this.state.details };
    let systemFee = { ...this.state.details.systemFee };
    systemFee = Object.assign({}, systemFee, { value: data.convenienceFee });
    this.setState({ details: Object.assign(details, { systemFee }) }, () =>
      this.updateTotalShippingCost()
    );
  };

  computePrice = () => {
    if (
      this.state.details.fixMatrix.value &&
      this.state.details.fixMatrix.value !== "none"
    ) {
      return;
    }

    const {
      destination,
      declaredValue,
      paxs,
      packageWeight,
      type,
      length,
    } = this.state.details;

    const busCompanyId = this.userProfileObject.getBusCompanyId();
    const startStation = this.userProfileObject.getAssignedStationId();
    const selectedOption = destination.options.filter(
      (e) => e.value === destination.value
    )[0];
    const endStation = selectedOption.endStation || undefined;
    const decValue = declaredValue.value
      ? parseFloat(declaredValue.value).toFixed(2)
      : undefined;
    const pax = paxs.value || 0;
    const parcel_length = length.value || 0;
    const weight = packageWeight.value
      ? parseFloat(packageWeight.value).toFixed(2)
      : undefined;

    if (
      !isNull(busCompanyId) &&
      !isNull(startStation) &&
      !isNull(endStation) &&
      !isNull(weight) &&
      !isNull(decValue)
    ) {

      ParcelService.getDynamicPrice(
        busCompanyId,
        decValue,
        endStation,
        type.value,
        pax,
        startStation,
        weight,
        parcel_length
      )
        .then((e) => {
          let details = { ...this.state.details };
          const { data, success, errorCode } = e.data;
          if (success) {
            const lengthRate = parseFloat(data.lengthRate);
            const declaredRate = parseFloat(data.declaredRate);
            const totalCost = parseFloat(data.totalCost);

            const shippingCost = {
              ...details.shippingCost,
              ...{ value: totalCost.toFixed(2) },
            };
            const packageInsurance = {
              ...details.packageInsurance,
              ...{ value: declaredRate.toFixed(2) },
            };
            details = { ...details, ...{ shippingCost } };
            details = { ...details, ...{ packageInsurance } };

            this.setState({ lengthRate: lengthRate.toFixed(2), details, }, () => this.updateTotalShippingCost());
          } else {
            this.handleErrorNotification(errorCode);
          }
        });
    }
  };

  dltbFixPriceComputation = () => {

    let d = { ...this.state.details }
    const options = {
      origin: UserProfile.getAssignedStationId(),
      destination: d.destination.value,
      declaredValue: d.declaredValue.value || 0,
      parcelCount: d.sticker_quantity.value,
      fixMatrixItemName: d.fixMatrix.value
    }
    ParcelService.getDltbFixMatrixComputation(options).then(e => {
      const { data, errorCode } = e.data;
      if (!errorCode) {
        const systemFee = Number(data.systemFee);
        let total = Number(data.computeTotalShippingCost);

        let qty = Number(d.quantity.value || 1)
        let quantity = qty < 1 ? 1 : qty;

        if (quantity > 1) {
          total -= systemFee;
          total = total * quantity;
          total += systemFee
        }
        total += Number(d.additionalFee.value || 0)

        d.totalShippingCost.value = total;
        d.packageInsurance.value = data.declaredValue
        d.systemFee.value = data.systemFee
        this.setState({ details: d })
      } else {
        this.handleErrorNotification(errorCode);
      }
    })
  }

  addFixMatrixFee = (_qty, addrate) => {
    let d = { ...this.state.details }
    let total = (Number(d.packageInsurance.value || 0) + Number(d.shippingCost.value || 0))
    let qty = Number(_qty || 0)
    let quantity = qty < 1 ? 1 : qty;
    total = total * quantity;
    total += Number(d.systemFee.value || 0)
    total += addrate
    d.totalShippingCost.value = total
    return total;
  }

  onInputChange = (name, value) => {

    let details = { ...this.state.details };

    if (name === "sticker_quantity" || name === "quantity") {
      const isValid = Number(value) > -1;
      let item = {
        ...details[name],
        ...{
          errorMessage: isValid ? "" : "Invalid number",
          value: Number(value),
          accepted: isValid,
        },
      };
      details = { ...details, ...{ [name]: item } };
    }

    if (UserProfile.getBusCompanyTag() === 'dltb') {
      let qty = undefined;
      let addrate = undefined

      if (name === 'quantity') {
        qty = Number(value)
        addrate = Number(details.additionalFee.value || 0)
        details.totalShippingCost.value = this.addFixMatrixFee(qty, addrate)
      }
      if (name == "additionalFee") {
        qty = Number(details.quantity.value || 1)
        addrate = Number(value)
        details.totalShippingCost.value = this.addFixMatrixFee(qty, addrate)
      }
    }

    if (name === "declaredValue") {
      switch (UserProfile.getBusCompanyTag()) {
        case 'isarog-liner':
          const packageInsurance = { ...details.packageInsurance };
          if (details.fixMatrix.value && details.fixMatrix.value !== "none") {
            let option = details.fixMatrix.options.find(
              (e) => e.name === details.fixMatrix.value
            );
            if (option) {
              let declaredValue = Number(option.declaredValue);
              let newVal = declaredValue > 0 ? Number(value) * (declaredValue / 100) : 0;
              packageInsurance.value = Number(newVal).toFixed(2);
            }
          } else {
            packageInsurance.value = 0;
          }
          details = { ...details, ...{ packageInsurance } };
          break;

        default:
          break;
      }
    }

    if (name === "billOfLading") {
      this.setState({
        billOfLading: {
          ...this.state.billOfLading,
          ...{ value, accepted: !isNull(value) },
        },
      });
      return;
    }

    let item = {
      ...details[name],
      ...{ value, accepted: true, hasError: false },
    };

    this.setState({ details: { ...details, ...{ [name]: item } } }, () => {
      if (name === "declaredValue" || name === "quantity") {
        switch (UserProfile.getBusCompanyTag()) {
          case 'isarog-liner':
            this.updateTotalShippingCost();
            break;

          default:
            break;
        }
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
              },
              () => this.updateTotalShippingCost()
            );
          }
        }
      }
    });
  };

  onSelectChange = async (value, name) => {
    let details = { ...this.state.details };

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

        this.setState({ details, connectingCompanyComputation: 0 }, () =>
          this.updateTotalShippingCost()
        );
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
      details.fixMatrix = fixMatrix

      let description = { ...details.description }
      description.value = undefined;
      details.description = description;

      details = { ...details, ...{ destination } };
      this.setState({ details, selectedDestination });


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
            this.setState({ details });
          }
        } else {
          this.handleErrorNotification(errorCode);
        }
      });
    }

    if (name === "discount") {
      const additionNote = {
        ...details.additionNote,
        ...{
          value: value.toLowerCase() === "none" ? undefined : value,
          accepted: true,
        },
      };
      const discount = { ...details.discount, ...{ value, accepted: true } };
      details = { ...details, ...{ discount, additionNote } };
      this.setState({ details }, () => this.updateTotalShippingCost());
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
          this.updateTotalShippingCost();
        }
      );
    }

    if (name === "fixMatrix") {
      let details = { ...this.state.details };
      details.additionalFee.enabled = false
      details.quantity.value = 1;
      details.additionalFee.value = 0;
      details.sticker_quantity.value = 0;
      details.totalShippingCost.value = 0
      details.additionNote.value = ""

      if (value !== "none") {
        let option = details.fixMatrix.options.find((e) => e.name === value);
        let price = Number(option.price).toFixed(2);
        let declaredValue = Number(option.declaredValue);
        let enableAdditionalFee = Boolean(option.additionalFee || true)

        declaredValue = declaredValue / 100;
        details.fixMatrix.value = value;
        details.additionalFee.enabled = enableAdditionalFee;


        if (Number(declaredValue) === Number(0)) {
          details.packageInsurance.value = 0;
          details.packageInsurance.disabled = true;
          details.declaredValue.value = 0;
          details.declaredValue.disabled = true;
        } else {
          details.packageInsurance.value = 0;
          details.packageInsurance.disabled = false;
          details.declaredValue.value = 0;
          details.declaredValue.disabled = false;
          details.systemFee.value = 0;
        }

        details.packageWeight.disabled = true;
        details.packageWeight.value = 0;
        details.length.disabled = true;
        details.length.value = 0;
        details.quantity.disabled = false;
        details.quantity.value = 1;
        details.description.value = option.name;
        details.shippingCost.value = price;

        switch (UserProfile.getBusCompanyTag()) {
          case "dltb":
            details.totalShippingCost.value = price
            this.setState({ lengthRate: 0, details });
            break;

          default:
            this.setState({ lengthRate: 0, details }, () => {
              this.updateTotalShippingCost();
            });
            break;
        }
      } else {

        details.fixMatrix.value = "none";
        details.packageInsurance.disabled = false;
        details.declaredValue.disabled = false;
        details.packageWeight.disabled = false;
        details.description.value = "";

        details.packageInsurance.value = 0;
        details.declaredValue.value = 0;
        details.shippingCost.value = 0;
        details.packageWeight.value = 0;

        if (UserProfile.getBusCompanyTag() !== "dltb") {
          details.length.disabled = false;
        }

        details.length.value = 0;
        details.quantity.disabled = true;
        details.quantity.value = 1;

        switch (UserProfile.getBusCompanyTag()) {
          case "dltb":
            this.setState({ lengthRate: 0, details });
            break;

          default:
            this.setState({ lengthRate: 0, details }, () => {
              this.updateTotalShippingCost();
            });
            break;
        }
      }
    }
  };

  onTypeChange = (value) => {
    const details = { ...this.state.details };
    const type = { ...details.type, ...{ value } };
    const paxs = {
      ...details.paxs,
      ...{ value: 0, isRequired: value !== 3, disabled: value === 3 },
    };
    const quantity = { ...details.quantity, ...{ value: 0 } };
    const sticker_quantity = { ...details.sticker_quantity, ...{ value: 0 } };
    const packageWeight = { ...details.packageWeight, ...{ value: 0 } };
    const systemFee = { ...details.systemFee, ...{ value: 0 } };
    const totalShippingCost = { ...details.totalShippingCost, ...{ value: 0 } };
    const shippingCost = { ...details.shippingCost, ...{ value: 0 } };

    this.setState({
      details: {
        ...details,
        ...{
          systemFee,
          totalShippingCost,
          type,
          shippingCost,
          paxs,
          quantity,
          sticker_quantity,
          packageWeight,
        },
      },
    });
  };

  onCreateNewParcel = () => {
    window.location.reload(true);
  };

  stepView = (step) => {
    let view = null;

    switch (step) {
      case 1:
        view = (
          <>
            {this.state.enalbeBicolIsarogWays ? (
              <BicolIsarogForm
                enableInterConnection={this.state.enalbeBicolIsarogWays}
                onBlur={(name) => {
                  let item = this.onBlurValidation(name);
                  if (item)
                    this.setState({
                      details: { ...this.state.details, ...{ [name]: item } },
                    });
                }}
                lengthRate={this.state.lengthRate}
                details={this.state.details}
                onTypeChange={(e) => this.onTypeChange(e.target.value)}
                onSelectChange={(value, name) =>
                  this.onSelectChange(value, name)
                }
                onChange={(e) =>
                  this.onInputChange(e.target.name, e.target.value)
                }
              />
            ) : (
                <CreateParcelForm
                  enableInterConnection={this.state.enalbeBicolIsarogWays}
                  onBlur={(name) => {
                    let item = this.onBlurValidation(name);
                    if (item)
                      this.setState({
                        details: { ...this.state.details, ...{ [name]: item } },
                      });
                  }}
                  lengthRate={this.state.lengthRate}
                  details={this.state.details}
                  onTypeChange={(e) => this.onTypeChange(e.target.value)}
                  onSelectChange={(value, name) =>
                    this.onSelectChange(value, name)
                  }
                  onChange={(e) =>
                    this.onInputChange(e.target.name, e.target.value)
                  }
                />
              )}

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
        );
        break;
      case 0:
        view = (
          <>
            <WebCam
              image={this.state.packageImagePreview}
              onCapture={(packageImagePreview) =>
                this.setState({ packageImagePreview })
              }
            />
            <StepControllerView
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
          },
          () => this.updateTotalShippingCost()
        );
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
    const { declaredValue, packageWeight, sticker_quantity, destination, length } = this.state.details;
    const selectedOption = destination.options.filter((e) => e.value === destination.value)[0];
    const endStation = selectedOption.endStation || undefined;
    const startStation = this.userProfileObject.getAssignedStationId();

    if (!endStation || !startStation)
      return

    console.info('endStation', endStation)
    console.info('startStation', startStation)

    const option = {
      origin: startStation,
      destination: endStation,
      declaredValue: Number(declaredValue.value),
      weight: Number(packageWeight.value),
      parcelCount: Number(sticker_quantity.value),
      length: Number(length.value)
    }

    ParcelService.getDltbComputation(option)
      .then(e => {
        console.log('getDltbComputation', e)
        const { data, errorCode } = e.data;

        if (!errorCode) {
          const {
            totalShippingCost,
            declaredValueFee,
            systemFee,
          } = data;

          let total = Number(totalShippingCost)

          const _data = { ...this.state.details }
          let quantity = Number(_data.quantity.value || 1)
          quantity = quantity > 0 ? quantity : 1;

          if (quantity > 1) {
            total -= Number(systemFee)
            total = total * quantity
          }

          _data.totalShippingCost.value = Number(total || 0).toFixed(2);
          _data.packageInsurance.value = declaredValueFee;
          _data.systemFee.value = systemFee;
          _data.shippingCost.value = Number(Number(totalShippingCost) - (Number(systemFee) + Number(declaredValue))).toFixed(2)
          this.setState({ details: _data });
        }
      })
  }

  componentDidUpdate(prevProps, prevState) {

    const {
      destination,
      packageWeight,
      declaredValue,
      paxs,
      length,
      sticker_quantity,
      fixMatrix,
      additionalFee
    } = prevState.details;

    const currentDetails = { ...this.state.details };
    const oldConnectingRoutes = prevState.details.connectingRoutes.value;
    const oldConnectingCompany = prevState.details.connectingCompany.value;

    const hasFreshData =
      currentDetails.destination.value !== destination.value ||
      currentDetails.packageWeight.value !== packageWeight.value ||
      currentDetails.declaredValue.value !== declaredValue.value ||
      currentDetails.length.value !== length.value ||
      currentDetails.fixMatrix.value !== fixMatrix.value ||
      currentDetails.additionalFee.value !== additionalFee.value ||
      currentDetails.sticker_quantity.value !== sticker_quantity.value ||
      oldConnectingRoutes !== currentDetails.connectingRoutes.value ||
      oldConnectingCompany !== currentDetails.connectingCompany.value;

    if (hasFreshData) {

      if (currentDetails.packageWeight.value !== undefined && currentDetails.declaredValue.value !== undefined) {
        this.computeForConnectinRoutes();

        if (currentDetails.destination.value !== undefined) {
          if (
            currentDetails.type.value !== 3 &&
            currentDetails.paxs.value === paxs.value
          ) {
            return;
          }

          console.info("tag", UserProfile.getBusCompanyTag())
          const { declaredValue, packageWeight, sticker_quantity, length } = currentDetails;

          switch (UserProfile.getBusCompanyTag()) {
            case "dltb":
              if (declaredValue.value && packageWeight.value && sticker_quantity.value) {
                this.requestComputation()
              }
              break;

            case "five-star":
              if (declaredValue.value && packageWeight.value && sticker_quantity.value && length.value) {
                this.requestComputation()
              }
              break;

            default:
              this.computePrice();
              const oldDetails = prevState.details;
              const curDetails = this.state.details;
              if (
                (this.state.details.fixMatrix.value === "none" ||
                  this.state.details.fixMatrix.value === undefined) &&
                (oldDetails.shippingCost.value !== curDetails.shippingCost.value ||
                  oldDetails.systemFee.value !== curDetails.systemFee.value ||
                  oldDetails.packageInsurance.value !==
                  curDetails.packageInsurance.value ||
                  prevState.connectingCompanyComputation !==
                  this.state.connectingCompanyComputation)
              ) {
                this.updateTotalShippingCost();
              }
              break;
          }
        }
      }
    }
  }

  updateTotalShippingCost = () => {
    console.info("updateTotalShippingCost>>>>>>>>>>>>>>>>>>>>>>")
    let currentDetails = { ...this.state.details };
    const quantity = Number(currentDetails.quantity.value || 0);

    let total = Number(
      parseFloat(currentDetails.shippingCost.value || 0) +
      parseFloat(this.state.lengthRate) +
      parseFloat(currentDetails.packageInsurance.value || 0)
    );

    let discountIndex = currentDetails.discount.options.findIndex(
      (e) => e.name === currentDetails.discount.value
    );
    let discount = 0;

    if (
      currentDetails.discount.value &&
      currentDetails.discount.value.toLowerCase() !== "none"
    ) {
      discount =
        discountIndex > -1
          ? Number(currentDetails.discount.options[discountIndex].rate || 0)
          : 0;
    }
    if (discount > 0) {
      total = total * ((100 - discount) / 100);
    }

    if (quantity > 0) {
      total = total * quantity;
    }

    //total +=
    //  parseFloat(this.state.connectingCompanyComputation || 0) //+
    //parseFloat(currentDetails.systemFee.value || 0);

    if (this.userProfileObject.isIsarogLiners()) {
      total += parseFloat(this.state.connectingCompanyComputation || 0)
      let systemFee = { ...currentDetails.systemFee, ...{ value: 0 } };
      if (total < 500) {
        total += 10;
        systemFee = { ...currentDetails.systemFee, ...{ value: 10 } };
      }
      currentDetails.systemFee = systemFee
    } else {
      total += parseFloat(currentDetails.systemFee.value || 0)
    }

    const totalShippingCost = { ...currentDetails.totalShippingCost, ...{ value: parseFloat(total).toFixed(2) } };
    this.setState({ details: { ...currentDetails, ...{ totalShippingCost } } });
  };

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
    const { width } = this.state;
    return (
      <Layout className="create-parcelview-parent-container">
        <Header className="home-header-view" style={{ padding: 0 }}>
          <div style={{ float: "left" }}>
            <Button
              type="link"
              onClick={() => this.props.history.push(alterPath("/"))}
            >
              <ArrowLeftOutlined style={{ fontSize: "20px", color: "#fff" }} />
              <span style={{ fontSize: "20px", color: "#fff" }}>Home</span>
            </Button>
          </div>
        </Header>

        <Layout>
          {width > MIN_WIDTH && (
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
              <div
                className={`horizontal-step ${width > MIN_WIDTH ? "hide" : ""}`}
              >
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
