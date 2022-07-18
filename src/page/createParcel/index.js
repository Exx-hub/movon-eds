import React from "react";
import "./create.scss";
import { CreateForm } from "../../component/createParcelForm";
import StepsView from "../../component/steps";
import WebCam from "../../component/webcam";
import ScheduledTrips from "../../component/scheduledTrips";
import ReviewDetails from "../../component/reviewDetails";
import TicketView from "../../component/ticketView";
import { Button, notification, Layout, Checkbox, Input, Form } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import ParcelService from "../../service/Parcel";
import MatrixService from "../../service/Matrix";
import ManifestService from "../../service/Manifest";
import {
  openNotificationWithIcon,
  debounce,
  UserProfile,
  alterPath,
} from "../../utility";

import { Header } from "../../component/header";
import { CustomModal, LogoutModal } from "../../component/modal";
import { IdleTimerContainer } from "../../component/idleTimer";

const { Content, Sider } = Layout;

// const CARGO_TYPES={
//   CARGO_PADALA:3,
//   EXCESS_NON_AC:2,
//   EXCESS_AC:1
// }

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

const isNull = (value) =>
  value === null || value === undefined || value === "" || value === 0;

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
        `step-controller-container-item ${
          props.width < 500 ? "button-steps" : ""
        }`,
      ]}
    >
      {!props.disablePreviousButton && (
        <Button
          className="create-btn btn-prev"
          style={{ display: `${props.display}` }}
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
          className={`${
            props.disabled ? "create-btn disabled-btn" : "create-btn btn-next"
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
  const destination = { ...state.details.destination };

  const option = destination.options.find(
    (e) => e.endStation === destination.value
  );

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
    cashier: UserProfile.getPersonFullName(),
    type: "create",

    ambulantDate: state.details.ambulantDate.value,
    busNumber: state.details.busNumber.value, // testing to pass busNumber value to review details
    cargoType: state.details.type.value
  };
};

const parseResponseData = (data) => {
  console.log("created parcel response data:", data);

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
    transactionDate: data.transactionDate,
    subParcels: data.subParcels,
    cashier: data.deliveryPersonInfo.deliveryPersonName,
    busNumber: data.busNumber, // able to display in ticketview if needed***
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
          errorMessage: "Bill of Lading is required!",
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
              name: "Excess Baggage",
              disabled: true,
            },
            // {
            //   value: 2,
            //   name: "Excess Non AC",
            //   disabled: true,
            // },
            {
              value: 3,
              name: "Cargo Padala",
              disabled: false,
            },
            {
              value: 4,
              name: "Volumetric",
              disabled: true,
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
        fixMatrix: {
          name: "fixMatrix",
          value: undefined,
          isRequired: false,
          accepted: true,
          options: [],
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
          enabled: false,
        },
        ambulantDate: {
          name: "ambulantDate",
          value: undefined,
          isRequired: UserProfile.getAssignedStationName().includes("Ambulant")
          ? true
          : false,
          accepted: true,
        },
        busNumber: {
          name: "busNumber",
          value: undefined,
          isRequired: false,
          accepted: true,
        },
        length: {
          name: "length",
          value: undefined,
          isRequired: false,
          accepted: true,
          errorMessage: "Length is required!",
        },
        width: {
          name: "width",
          value: undefined,
          isRequired: false,
          accepted: true,
          errorMessage: "Width is required!",
        },
        height: {
          name: "height",
          value: undefined,
          isRequired: false,
          accepted: true,
          errorMessage: "Height is required!",
        },
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
      stopStep: false,
      createModal: {
        visible: false,
        data: {},
        title: "Bill of Lading Exist!",
      },
      enabledExcessCargo: false,
      logoutModal: { visible: false },
    };
    this.userProfileObject = UserProfile;
    this.fixPriceComputation = debounce(this.fixPriceComputation, 500);
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

    // let discount = { ...details.discount };
    // discount.options = [
    //   ...this.userProfileObject.getBusCompanyDiscount(),
    //   ...[{ name: "None", rate: "None" }],
    // ];
    // details.discount = discount;

    switch (UserProfile.getBusCompanyTag()) {
      case "dltb":
        details.length.disabled = true;
        details.length.isRequired = false;
        details.discount.disabled = true;
        details.type.options[0].name = "Accompanied Baggage";
        // details.declaredValue.disabled = false;
        details.busNumber.disabled = true;
        details.busNumber.value = "-to be assigned-";
        break;

      case "isarog-liner":
        details.billOfLading.disabled = true;
        details.length.required = false;
        details.width.disabled = true;
        details.height.disabled = true;
        break;

      case "five-star":
        details.discount.disabled = true;
        break;

      case "tst":
        details.length.disabled = true;
        details.length.isRequired = false;
        details.discount.disabled = true;
        details.type.options[0].name = "Accompanied Baggage";
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
        const { data, errorCode } = e.data;
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
      .catch((e) => console.info("error", e));
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
        this.setState({ stopStep: true, createParcelResponseData: data }, () =>
          this.gotoNextStep()
        );
      } else {
        if (Number(errorCode) === 4012) {
          let createModal = { ...this.state.createModal };
          createModal.visible = true;
          this.setState({ createModal });
        } else {
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
      if (
        !_details[name].disabled &&
        _details[name].isRequired &&
        isNull(_details[name].value)
      ) {
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
      this.setState({ stopStep: true });
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
          if (
            !tempDetails[e].disabled &&
            tempDetails[e].isRequired &&
            isNull(tempDetails[e].value)
          ) {
            const item = { ...tempDetails[e], ...{ accepted: false } };
            tempDetails = { ...tempDetails, ...{ [e]: item } };
          }
        });
        this.setState({ details: tempDetails });
        return false;
      } else {
        const totalShippingCost = Number(
          this.state.details.totalShippingCost.value
        );
        const discountFee = Number(this.state.discountFee);
        let _option = this.getDiscountOption();
        // let foc = (_option && _option.foc) || 0; -- not working / replaced with below
        let foc = (_option && this.state.details.discount.foc) || 0;
        let hasMissingValue =
          Number(foc || 0) === 1 ? discountFee === 0 : totalShippingCost === 0;

        // console.log("FOC:", foc);
        // console.log("option:", _option);
        // console.log("hasMissingValue:", hasMissingValue);

        if (hasMissingValue) {
          showNotification({
            title: "Missing Payment Breakdown",
            type: "error",
            message:
              "No computation have been made, please click the 'Compute Now' button",
          });
          return;
        }

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

  fixPriceComputation = () => {
    let d = { ...this.state.details };

    console.log("FIX PRICE COMPUTATION:", d);

    const options = {
      origin: UserProfile.getAssignedStationId(),
      destination: d.destination.value,
      declaredValue: d.declaredValue.value || 0,
      parcelCount: d.sticker_quantity.value,
      fixMatrixItemName: d.fixMatrix.value,
      quantity: d.quantity.value,
      additionalFee: d.additionalFee.value,
      discountName:
        (d.discount.value && d.discount.value.toLowerCase()) || "none",
      cargoType: d.type.value || 3,
    };

    ParcelService.getDefaultFixMatrixComputation(options)
      .then((e) => {
        const { data, errorCode } = e.data;
        console.log("OPTION:", options);
        console.info("GET DEFAULT FIX MATRIX COMPUTATION", e);
        if (!errorCode) {
          const {
            declaredValueFee,
            systemFee,
            basePrice,
            portersFee,
            additionalFee,
            discountFee,
            computeTotalShippingCost,
          } = data;

          d.totalShippingCost.value = computeTotalShippingCost;
          d.systemFee.value = systemFee;

          this.setState({
            discountFee,
            declaredValueFee,
            isFixedPrice: true,
            basePrice,
            details: d,
            portersFee,
            additionalFee,
          });
        } else {
          this.handleErrorNotification(errorCode);
        }
      })
      .catch(() => {
        showNotification({
          title: "Server Error",
          type: "error",
          message: "Can't process computation, please try again.",
        });
        this.handleView("default", this.state.details, () => {});
      });
  };

  onInputChange = (name, value) => {
    let details = { ...this.state.details };
    details[name] = {
      ...details[name],
      ...{ value, accepted: true, hasError: false },
    };

    //do not clear the payment breakdown
    const excludedNames = ["billOfLading", "additionNote", "description"];
    if (excludedNames.includes(name)) {
      this.setState({ details });
    } else {
      //clear payment breakdown
      this.handleView("input-change", details, () => {});
    }
  };

  onDateChange = (date) => {
    let details = { ...this.state.details };
    details.ambulantDate.value = date;
    if (date) {
      this.setState({ details });
    }
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
            this.setState({
              connectingCompanyComputation: data.total,
              tariffRate: e.tariffRate,
            });
          }
        }
      }
    });
  };

  fetchFixMatrix = (_details) => {
    const options = {
      destination: _details.destination.value,
      origin: UserProfile.getAssignedStationId(),
      cargoType: _details.type.value,
    };

    ParcelService.getExcessBaggageStatus(options).then((e) => {
      console.info("getExcessBaggageStatus", e);
      const { data, errorCode } = e.data;

      console.info("data.discountOption", data.discountOption);

      if (errorCode) {
        this.handleErrorNotification(errorCode);
        return;
      }

      let details = { ...this.state.details, ..._details };
      details.fixMatrix = Object.assign({}, details.fixMatrix, {
        accepted: true,
        options: [
          ...[{ name: "none", price: 0, declaredValue: 0 }],
          ...(data.fixMatrix || []),
        ],
      });
      details.discount = Object.assign({}, details.discount, {
        value: "",
        options: [
          ...[{ name: "none", rate: 0 }],
          ...(data.discountOption || []),
        ],
      });

      let enabledExcessCargo = data.enabledExcessCargo || false;
      if (typeof enabledExcessCargo === "string") {
        enabledExcessCargo = Boolean(enabledExcessCargo === "true");
      }
      const typeOptions = details.type.options.map((e) => {
        let disabled = false;
        if (e.name !== "Cargo Padala") {
          disabled = !enabledExcessCargo;
        }
        return { ...e, disabled };
      });
      details.type = { ...details.type, ...{ options: typeOptions } };
      this.setState({ enabledExcessCargo, details });
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
      //const selectedDestination = details.destination.options.find((e) => e.value === value);
      details.destination = {
        ...details.destination,
        ...{ value, accepted: true },
      };
      details.fixMatrix.value = "";
      this.handleView("destination-change", details, () => {
        this.fetchFixMatrix(details);
      });
    }

    if (name === "discount") {
      details.additionNote.value =
        value.toLowerCase() === "none" ? undefined : value;
      details.additionNote.accepted = true;
      details.discount.value = value;
      details.discount.accepted = true;
      this.handleView("discount-change", details, () => {});
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
      const details = { ...this.state.details };
      details.fixMatrix.value = value;
      this.handleView("fix-matrix-change", details, () => {});
    }
  };

  onTypeChange = (value) => {
    const details = { ...this.state.details };
    details.type = { ...details.type, value };
    this.handleView("onTypeChange", details, () => {
      this.fetchFixMatrix(details);
    });
  };

  onCreateNewParcel = () => {
    window.location.reload(true);
  };

  getFixMatrixOption = () => {
    const fixMatrix = { ...this.state.details.fixMatrix };
    return (
      fixMatrix.options.find((e) => e.name === (fixMatrix.value || "none")) || [
        { name: "none", price: 0, declaredValue: 0 },
      ]
    );
  };

  onCompute = () => {
    const option = this.getFixMatrixOption();
    const details = { ...this.state.details };

    let hasError = false;
    let forValidation = [
      "declaredValue",
      "packageWeight",
      "sticker_quantity",
      "destination",
    ];
    forValidation.forEach((e) => {
      if (!details[e].disabled && Number(details[e].value || 0) === 0) {
        details[e].accepted = false;
        hasError = true;
      }
    });

    if (hasError) {
      this.setState({ details });
      return;
    }

    if (option && option.name === "none") {
      this.requestComputation();
    } else {
      this.fixPriceComputation();
    }
  };

  releaseError = (details) => {
    let names = [];
    for (var p in details) {
      if (details[p].accepted === false) {
        names.push(p);
        details[p].accepted = true;
      }
    }
  };

  getDiscountOption = () => {
    let discount = { ...this.state.details.discount };
    console.log("value before select - DISCOUNT.:", discount);
    let _option = discount.options.find((e) => e.name === discount.value);
    return _option;
  };

  defaultHandleView = (name, _details, callback) => {
    const details = { ...this.state.details, ..._details };
    const option = this.getFixMatrixOption();
    const isAccompanied = Number(details.type.value || 3) < 3;
    const isFixPrice = option && option.name !== "none";
    const isVolumetric = Number(details.type.value || 3) > 3;

    let selectedDestination = this.state.selectedDestination;
    details.systemFee.value = 0;
    details.totalShippingCost.value = 0;

    let hideLength = undefined;
    let hideDeclaredValue = undefined;
    let hideQuantity = undefined;
    let hideWeight = undefined;
    let hideWidth = undefined;
    let hideHeight = undefined;

    switch (name) {
      case "onTypeChange":
        this.releaseError(details);

        hideLength = true;
        hideDeclaredValue = true;
        hideQuantity = true;
        hideWeight = false;
        hideWidth = true;
        hideHeight = true;

        if (!isAccompanied) {
          //Cargo
          hideLength = !hideLength;
          hideDeclaredValue = !hideDeclaredValue;
        }

        if(isVolumetric){
          //cargo
          hideWeight = !hideWeight;
          hideWidth = !hideWidth;
          hideHeight = !hideHeight;
        }

        details.declaredValue.disabled = hideDeclaredValue;
        details.quantity.disabled = hideQuantity;
        details.length.disabled = hideLength;
        details.packageWeight.disabled = hideWeight;
        details.width.disabled = hideWidth;
        details.height.disabled = hideHeight;

        details.fixMatrix.value = "";
        details.quantity.value = 1;
        break;

      case "fix-matrix-change":
        hideLength = false;
        hideDeclaredValue = false;
        hideWeight = false;
        hideQuantity = true;

        this.releaseError(details);
        details.description.value =
          option && option.name && option.name === "none" ? "" : option.name;
        details.additionalFee.enabled =
          option && (option.additionalFee || false);

        if (!isFixPrice) {
          //NONE
          if (isAccompanied) {
            //CARGO
            hideLength = true;
            hideDeclaredValue = true;
          }
        } else {
          hideQuantity = false;
          hideLength = true;
          hideDeclaredValue = true;
          hideWeight = true;

          if (option && (option.additionalFee || false) === false) {
            details.additionalFee.enabled = false;
            details.additionalFee.value = undefined;
          }

          if (option && (option.declaredValue || 0) > 0) {
            hideDeclaredValue = false;
          }
        }

        details.length.disabled = hideLength;
        details.length.value = !hideLength ? details.length.value : undefined;

        details.declaredValue.disabled = hideDeclaredValue;
        details.declaredValue.value = !hideDeclaredValue
          ? details.declaredValue.value
          : undefined;

        details.quantity.disabled = hideQuantity;
        details.quantity.value = !hideQuantity ? details.quantity.value : 1;

        details.packageWeight.disabled = hideWeight;
        details.packageWeight.value = !hideWeight
          ? details.packageWeight.value
          : undefined;
        break;

      case "discount-change":
        details.additionNote.disabled = false;
        details.additionNote.value = "";

        let _option = this.getDiscountOption();
        console.info("_option", _option);
        if (_option.name !== "none") {
          details.additionNote.disabled = true;
          details.additionNote.value = _option.name;
        }
        // details.discount.foc = (_option && _option.foc) || 0; -- not working / replaced with below
        details.discount.foc =
          (_option && _option.name === "For Donation (FOC - 100%)") || 0;
        console.log("Updated foc value - Discount:", details.discount);
        break;

      case "input-change":
        //todo:
        break;

      case "destination-change":
        details.description.value =
          option && option.name && option.name === "none" ? "" : option.name;
        selectedDestination = details.destination.options.find(
          (e) => e.value === details.destination.value
        );
        break;

      default:
        break;
    }
    this.setState(
      {
        details,
        selectedDestination,
        basePrice: 0,
        declaredValueFee: 0,
        discountFee: 0,
        systemFee: 0,
        portersFee: 0,
        lengthFee: 0,
        weightFee: 0,
        isShortHaul: undefined,
      },
      callback()
    );
  };

  dltbHandleView = (name, _details, callback) => {
    const details = { ...this.state.details, ..._details };
    const option = this.getFixMatrixOption();
    const isAccompanied = Number(details.type.value || 3) < 3;
    const isFixPrice = option && option.name !== "none";

    let selectedDestination = this.state.selectedDestination;
    details.systemFee.value = 0;
    details.totalShippingCost.value = 0;

    // let hideLength = undefined;
    let hideDeclaredValue = undefined;
    let hideQuantity = undefined;
    let hideWeight = undefined;

    switch (name) {
      case "onTypeChange":
        this.releaseError(details);

        hideDeclaredValue = true;
        hideQuantity = true;
        hideWeight = false;
       
        if (isAccompanied) {
          details.busNumber.disabled = false;
          details.busNumber.isRequired = true;
          details.busNumber.value = "";
        } else {
          details.busNumber.disabled = true;
          details.busNumber.value = "-to be assigned-";
        }

        details.quantity.disabled = hideQuantity;
        details.packageWeight.disabled = hideWeight;

        details.fixMatrix.value = "";
        details.quantity.value = 1;
        break;

      case "fix-matrix-change":
        hideDeclaredValue = false;
        hideWeight = false;
        hideQuantity = true;

        this.releaseError(details);
        details.description.value =
          option && option.name && option.name === "none" ? "" : option.name;
        details.additionalFee.enabled =
          option && (option.additionalFee || false);
        details.quantity.value = 1;

        if (!isFixPrice) {
          //NONE
          if (isAccompanied) {
            //CARGO
            // hideDeclaredValue = true; // accompanied and clicked none in fix price, enable DV input
          }
        } else {
          hideQuantity = false;
          hideDeclaredValue = true;
          hideWeight = true;

          if (option && (option.additionalFee || false) === false) {
            details.additionalFee.enabled = false;
            details.additionalFee.value = undefined;
          }

          if (option && (option.declaredValue || 0) > 0) {
            hideDeclaredValue = false;
          }
        }

        details.declaredValue.disabled = hideDeclaredValue;
        details.declaredValue.value = !hideDeclaredValue
          ? details.declaredValue.value
          : undefined;

        details.quantity.disabled = hideQuantity;
        details.quantity.value = !hideQuantity ? details.quantity.value : 1;

        details.packageWeight.disabled = hideWeight;
        details.packageWeight.value = !hideWeight
          ? details.packageWeight.value
          : undefined;
        break;

      case "discount-change":
        details.additionNote.disabled = false;
        details.additionNote.value = "";

        let _option = this.getDiscountOption();
        console.info("_option", _option);
        if (_option.name !== "none") {
          details.additionNote.disabled = true;
          details.additionNote.value = _option.name;
        }
        break;

      case "input-change":
        //todo:
        break;

      case "destination-change":
        details.description.value =
          option && option.name && option.name === "none" ? "" : option.name;
        selectedDestination = details.destination.options.find(
          (e) => e.value === details.destination.value
        );
        break;

      default:
        break;
    }

    this.setState(
      {
        details,
        selectedDestination,
        basePrice: 0,
        declaredValueFee: 0,
        discountFee: 0,
        systemFee: 0,
        portersFee: 0,
        lengthFee: 0,
        weightFee: 0,
        isShortHaul: undefined,
        handlingFee: 0,
        insuranceFee: 0,
        additionalFee: 0,
        isFixedPrice: 0,
      },
      callback
    );
  };

  handleView = (name, details, callback) => {
    switch (UserProfile.getBusCompanyTag()) {
      case "dltb":
        this.dltbHandleView(name, details, callback);
        break;

      case "tst":
        this.dltbHandleView(name, details, callback);
        break;

      default:
        this.defaultHandleView(name, details, callback);
        break;
    }
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
                    discountFee: this.state.discountFee,
                    enabledExcessCargo: this.state.enabledExcessCargo,
                  }}
                  details={this.state.details}
                  onTypeChange={(e) => this.onTypeChange(e.target.value)}
                  onSelectChange={(value, name) =>
                    this.onSelectChange(value, name)
                  }
                  onChange={(val, name) => this.onInputChange(name, val)}
                  onCompute={() => this.onCompute()}
                  onDateChange={(date) => this.onDateChange(date)}
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
            );
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
            <div style={{ marginTop: "3rem" }}>
              <WebCam
                image={this.state.packageImagePreview}
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
                //console.info('ScheduledTrips selectedTrip', selectedTrip)
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
              onNextStep={() => {}}
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

              <div
                style={{
                  display:
                    UserProfile.getBusCompanyTag() === "dltb" ? "none" : "",
                }}
                className="checkbox-container"
              >
                <Checkbox
                  checked={this.state.checkIn}
                  onChange={(e) => this.setState({ checkIn: e.target.checked })}
                >
                  Check In <CheckCircleOutlined />
                </Checkbox>
              </div>
            </div>
          </>
        );
        break;
      case 4:
        view = (
          <>
            <div ref={(el) => (this.printEl = el)}>
              <TicketView
                value={parseResponseData(this.state.createParcelResponseData)}
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
        this.setState({
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
    const {
      declaredValue,
      packageWeight,
      sticker_quantity,
      destination,
      length,
      discount,
      type,
      width,
      height
    } = this.state.details;
    const selectedOption = destination.options.filter(
      (e) => e.value === destination.value
    )[0];
    const endStation = selectedOption.endStation || undefined;
    const startStation = this.userProfileObject.getAssignedStationId();
    const discountName =
      (discount.value && discount.value.toLowerCase()) || "none";

    if (!endStation || !startStation) return;

    const option = {
      origin: startStation,
      destination: endStation,
      declaredValue: Number(declaredValue.value),
      weight: Number(packageWeight.value),
      parcelCount: Number(sticker_quantity.value),
      length: Number(length.value),
      discountName,
      cargoType: type.value === 4 ? 3 : type.value || 3,
      width: width.value ? Number(width.value) : undefined,
      height: height.value ? Number(height.value) : undefined,
      isVolumeMetric: type.value === 4 ? 1 : null
    };

    ParcelService.getDefaultComputation(option)
      .then((e) => {
        console.log("OPTION:", option);
        console.info("GET DEFAULT COMPUTATION", e.data.data);
        const { data, errorCode } = e.data;
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
            discountFee,
            weight,
          } = data;

          const _lengthFee = Number(lengthFee || 0);
          const _weightFee = Number(weightFee || 0);
          const _additionFee = Number(additionalFee || 0);
          const _systemFee = Number(systemFee || 0);
          const _declaredValueFee = Number(declaredValueFee || 0);
          let total = Number(totalShippingCost || 0);

          const _weight = Number(weight || 0)

          const _shippingCost = Number(shippingCost);
          const _data = { ...this.state.details };

          let quantity = Number(_data.quantity.value || 1);
          quantity = quantity > 0 ? quantity : 1;

          if (quantity > 1) {
            total = shippingCost * quantity;
          }
          
          _data.totalShippingCost.value = total;
          _data.packageInsurance.value = _declaredValueFee;
          _data.additionalFee.value = _additionFee;
          _data.systemFee.value = _systemFee;
          _data.shippingCost.value = _shippingCost;
          _data.packageWeight.value = _weight.toFixed(2);

          this.setState({
            discountFee,
            portersFee,
            insuranceFee,
            declaredValueFee,
            handlingFee,
            lengthFee: _lengthFee.toFixed(2),
            weightFee: _weightFee.toFixed(2),
            details: _data,
            basePrice,
            isShortHaul: Boolean(isShortHaul),
            isFixedPrice: false,
          });
        } else {
          this.handleErrorNotification(errorCode);
        }
      })
      .catch(() => {
        showNotification({
          title: "Server Error",
          type: "error",
          message: "Can't process computation, please try again.",
        });
        this.handleView("default", this.state.details, () => {});
      });
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

  setLogoutModal = (params) => {
    const logoutModal = { ...this.state.logoutModal, ...params };
    this.setState({ logoutModal });
  };

  render() {
    //console.info('create parcel',this.props)
    return (
      <>
        <Layout
          className="create-parcelview-parent-container"
          style={{ background: "white" }}
        >
          <Header
            {...this.props}
            setVisibleLogout={() => this.setLogoutModal({ visible: true })}
          />

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

          {/* EXISTING BILL OF LADING MODAL ----------------------------------------- */}
          <CustomModal
            width={500}
            visible={this.state.createModal.visible}
            title={this.state.createModal.title}
          >
            <section className="bill-of-lading-modal-section">
              <p className="message">
                You have entered an existing bill of lading. Please replace it
                and continue.
              </p>

              <Form
                onFinish={(value) => {
                  let details = { ...this.state.details };
                  let billOfLading = { ...details.billOfLading };
                  billOfLading.value = value.billOfLading;
                  billOfLading.accepted = true;
                  details.billOfLading = billOfLading;

                  let createModal = { ...this.state.createModal };
                  createModal.visible = false;

                  this.setState({ details, createModal }, () => {
                    this.createParcel();
                  });
                }}
                name="modal-form"
              >
                <section className="input-section">
                  <Form.Item
                    name="billOfLading"
                    label="Bill of Lading"
                    rules={[
                      {
                        required: true,
                        message: "Bill of lading is required field",
                      },
                      (field) => ({
                        validator(rule, value) {
                          if (value && value.trim().indexOf(" ") > -1) {
                            return Promise.reject(
                              "White space is not allowed!"
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input size="large" placeholder="Bill of Lading" />
                  </Form.Item>
                </section>
                <section className="button-section">
                  <Button
                    onClick={() => {
                      let createModal = { ...this.state.createModal };
                      createModal.visible = false;
                      this.setState({ createModal });
                    }}
                    shape="round"
                    className="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    htmlType="submit"
                    shape="round"
                    className="button-update"
                  >
                    Validate
                  </Button>
                </section>
              </Form>
            </section>
          </CustomModal>
          <LogoutModal
            {...this.props}
            visible={this.state.logoutModal.visible}
            handleCancel={() => this.setLogoutModal({ visible: false })}
          />
        </Layout>
        {/* IDLE TIMER HERE ------------------- */}
        <IdleTimerContainer />
      </>
    );
  }
}
export default CreateParcel;
