import axios from "axios";
import moment from "moment";
import { config } from "../config";
import { UserProfile } from "../utility";
const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile;

const ParcelService = {
  getTrips: (stationId) => {
    // var currentTime = moment().utc().format('YYYY-MM-DDThh:mm:ss[Z]')
    //var todaysStartDate = moment().startOf('day').format('YYYY-MM-DDThh:mm:ss[Z]');
    //var tomorrowsStartTime = moment().add(1,'d').startOf('day').format('YYYY-MM-DDThh:mm:ss[Z]');

    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/home/trips`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: {
        //stationId: stationId,
        todaysStartDate: moment()
          .subtract(1, "day")
          .format("YYYY-MM-DDThh:mm:ss[Z]"),
        tomorrowsStartTime: moment()
          .add(1, "day")
          .format("YYYY-MM-DDThh:mm:ss[Z]"),
        currentTime: moment().format("YYYY-MM-DDThh:mm:ss[Z]"),
        //todaysStartDate,
        //tomorrowsStartTime,
        //currentTime
      },
    });
  },

  create: (state) => {
    const {
      details,
      checkIn,
      packageImagePreview,
      selectedTrip,
      tariffRate,
      lengthRate,
      portersFee,
      weightFee,
      handlingFee,
      lengthFee,
      declaredValueFee,
      basePrice,
      discountFee,
      insuranceFee,
    } = state;

    const {
      billOfLading,
      senderName,
      senderMobile,
      senderEmail,
      receiverName,
      receiverMobile,
      receiverEmail,
      description,
      declaredValue,
      quantity,
      sticker_quantity,
      systemFee,
      additionNote,
      packageInsurance,
      type,
      packageWeight,
      shippingCost,
      length,
      connectingCompanyComputation,
      connectingCompany,
      connectingRoutes,
      totalShippingCost,
      associateORNumber,
      busNumber,
      //tripCode,
      driverFullName,
      conductorFullName,
      additionalFee,
    } = details;

    const associatedTariffRate = tariffRate || undefined;
    const associatedDestination = connectingRoutes.value || undefined;
    const associatedCompanyId = connectingCompany.value || undefined;
    const associatedOrigin =
      (connectingRoutes.options.length > 0 &&
        connectingRoutes.options.filter((e) => e.end)[0].start) ||
      undefined;
    const associatedAmount = connectingCompanyComputation;

    const COUNTRY_CODE = "PH";
    const isAccompanied = Number(type.value || 3) !== 3;
    const PACKAGE_INSURANCE = 0;

    const bodyFormData = new FormData();
    bodyFormData.set("senderName", senderName.value);
    bodyFormData.set("senderEmail", senderEmail.value || "");
    bodyFormData.set("senderPhoneCountryCode", COUNTRY_CODE);
    bodyFormData.set("senderPhoneNumber", senderMobile.value);
    bodyFormData.set("recipientName", receiverName.value);
    bodyFormData.set("recipientEmail", receiverEmail.value || "");
    bodyFormData.set("recipientPhoneCountryCode", COUNTRY_CODE);
    bodyFormData.set("recipientPhoneNumber", receiverMobile.value);
    bodyFormData.set("packageName", description.value);
    bodyFormData.set("packageWeight", packageWeight.value || 0);
    bodyFormData.set("estimatedValue", declaredValue.value || 0);
    bodyFormData.set("accompanied", isAccompanied);
    bodyFormData.set("packageInsurance", PACKAGE_INSURANCE);
    bodyFormData.set("sticker_quantity", sticker_quantity.value || 0);
    bodyFormData.set("quantity", quantity.value || 0);
    bodyFormData.set("price", shippingCost.value || 0);
    bodyFormData.set("additionalNote", additionNote.value || "");
    bodyFormData.append("packageImage", packageImagePreview);
    bodyFormData.set("busId", selectedTrip.busId);
    bodyFormData.set("busCompanyId", selectedTrip.companyId);
    bodyFormData.set("tripId", selectedTrip.tripsId);
    bodyFormData.set("startStation", selectedTrip.startStationId);
    bodyFormData.set("endStation", selectedTrip.value);
    bodyFormData.set("checkIn", checkIn);
    bodyFormData.set("convenienceFee", systemFee.value || 0);
    bodyFormData.set("insuranceFee", packageInsurance.value || 0);
    bodyFormData.set("billOfLading", billOfLading.value);
    bodyFormData.set("associatedTariffRate", associatedTariffRate || 0);
    bodyFormData.set("associatedCompanyId", associatedCompanyId);
    bodyFormData.set("associatedOrigin", associatedOrigin);
    bodyFormData.set("associatedDestination", associatedDestination);
    bodyFormData.set("associatedAmount", associatedAmount);
    bodyFormData.set("parcel_length", (length && length.value) || 0);
    bodyFormData.set("lengthRate", lengthRate || 0);
    bodyFormData.set("totalShippingCost", totalShippingCost.value || 0);
    bodyFormData.set("busNumber", busNumber.value);
    //bodyFormData.set('tripCode',tripCode.value)
    bodyFormData.set("driverFullName", driverFullName.value);
    bodyFormData.set("conductorFullName", conductorFullName.value);
    bodyFormData.set("associateORNumber", associateORNumber.value);

    switch (UserProfile.getBusCompanyTag()) {
      case "dltb":
        bodyFormData.set(
          "paymentBreakdown",
          JSON.stringify({
            weightFee: Number(weightFee || 0),
            additionalFee: Number(additionalFee.value || 0),
            insuranceFee: Number(insuranceFee || 0),
            handlingFee: Number(handlingFee || 0),
            declaredvalueFee: Number(state.declaredValueFee || 0),
            basePrice: Number(basePrice || 0),
          })
        );
        break;
      case "five-star":
        const payload = {
          weightFee: Number(weightFee || 0),
          lengthFee: Number(lengthFee || 0),
          declaredvalueFee: Number(declaredValueFee || 0),
          basePrice: Number(basePrice || 0),
          discountFee: Number(discountFee || 0),
        };
        bodyFormData.set("paymentBreakdown", JSON.stringify(payload));
        break;

      default:
        bodyFormData.set(
          "paymentBreakdown",
          JSON.stringify({
            portersFee: Number(portersFee || 0),
            lengthFee: Number(lengthFee || 0),
            discountFee: Number(discountFee || 0),
            declaredvalueFee: Number(declaredValueFee || 0),
            basePrice: Number(basePrice || 0),
          })
        );
        break;
    }

    // check the value first, eliminate null
    // for (var pair of bodyFormData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]);
    // }

    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/create`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: bodyFormData,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    });
  },

  getDynamicPrice: (
    busCompanyId,
    claimAmount,
    endStation,
    type,
    paxNumber,
    startStation,
    weight,
    length
  ) => {
    let accompaniedValue = "";
    switch (type) {
      case 2:
        accompaniedValue = "Excess Non AC";
        break;
      case 3:
        accompaniedValue = "Cargo Padala";
        break;
      default:
        accompaniedValue = "Excess AC";
        break;
    }

    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/calculate`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: {
        claimAmount,
        endStation,
        type,
        startStation,
        weight,
        accompaniedValue,
        isAccompanied: type !== 3,
        paxNumber: type === 3 ? 0 : paxNumber,
        parcel_length: length,
      },
    });
  },

  getFareMatrix: (busCompanyId, declaredValue, weight, origin, destination) => {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/calculate-by-matrix/`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: {
        declaredValue,
        weight,
        origin,
        destination,
      },
    });
  },

  getConvenienceFee: (quantity, declaredValue) => {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/parcel-convenience-fee`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      params: {
        quantity,
        declaredValue,
      },
    });
  },

  getFiveStarConvenienceFee: (quantity) => {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/convenience-fee?quantity=${quantity}`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
    });
  },

  getConnectingBusPartners: () => {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/list/connecting-partners`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
    });
  },

  getTransactions: (busCompanyId) => {
    // TODO: Add filter parameters as query
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
    });
  },

  getConnectingRoutes: (companyId) => {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${companyId}/connecting-routes`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
    });
  },

  getTransactionSummary: (busCompanyId) => {
    // TODO: Add filter parameters as query
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/summary`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
    });
  },

  exportTransactions: (busCompanyId) => {
    // TODO: Add filter parameters as query
    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/export`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      responseType: "arraybuffer",
    }).then((response) => {
      // Source: https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Transactions.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  },

  getAllParcel: (
    startStation,
    dateFrom,
    dateTo,
    endStation,
    busCompanyId,
    page,
    limit,
    filterArray,
    cargoTypeArray
  ) => {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      params: {
        dateFrom,
        dateTo,
        startStation,
        endStation,
        page,
        limit,
        filterArray,
        cargoTypeArray
      },
    });
  },

  // getFilteredParcels: (
  //   startStation,
  //   dateFrom,
  //   dateTo,
  //   endStation,
  //   busCompanyId,
  //   page,
  //   limit,
  //   filterArray
  // ) => {
  //   return axios({
  //     method: "get",
  //     url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list`,
  //     headers: {
  //       "x-auth-deviceid": config.header.deviceId,
  //       "x-auth-devicetype": config.header.deviceType,
  //       "x-auth-token": userProfileObject.getToken(),
  //     },
  //     params: {
  //       dateFrom,
  //       dateTo,
  //       startStation,
  //       endStation,
  //       page,
  //       limit,
  //       filterArray
  //     },
  //   });
  // },

  exportCargoParcel: (
    title,
    dateFrom,
    dateTo,
    startStation,
    endStation,
    fullName,
    totalAmount,
    destination,
    isP2P,
    busCompanyId
  ) => {
    const filename = isP2P ? "VLI-BITSI-Summary.XLSX" : "Cargo.XLSX";

    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list/export`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      responseType: "arraybuffer",
      params: {
        title,
        dateFrom,
        dateTo,
        startStation,
        endStation,
        destination,
        totalAmount,
        fullName,
        date: `${dateFrom} - ${dateTo}`,
        isP2P: isP2P ? 1 : 0,
        filename,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  },

  exportCargoParcelPDF: (
    title,
    dateFrom,
    dateTo,
    startStation,
    endStation,
    fullName,
    totalAmount,
    destination,
    isP2P,
    busCompanyId
  ) => {
    const filename = "Cargo.PDF";

    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list/export-pdf`,
      headers: {
        "x-auth-deviceid": config.header.deviceId,
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      responseType: "arraybuffer",
      params: {
        title,
        dateFrom,
        dateTo,
        startStation,
        endStation,
        destination,
        totalAmount,
        fullName,
        date: `${dateFrom} - ${dateTo}`,
        isP2P: isP2P ? 1 : 0,
        filename,
      },
    }).then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  },

  parcelPagination: (page, limit, search) => {
    return axios({
      method: "get",
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/list/search-all`,
      headers: {
        "x-auth-deviceid": "1",
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      params: { page, limit, search },
    });
  },

  getDefaultComputation: ({
    origin,
    destination,
    declaredValue,
    weight,
    parcelCount,
    length,
    discountName,
    cargoType,
  }) => {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/matrix/computation`,
      headers: {
        "x-auth-deviceid": "1",
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: {
        origin,
        destination,
        declaredValue,
        weight,
        parcelCount,
        length,
        discountName,
        cargoType,
      },
    });
  },

  getDefaultFixMatrixComputation: ({
    origin,
    destination,
    declaredValue,
    parcelCount,
    fixMatrixItemName,
    quantity,
    additionalFee,
    discountName,
    cargoType,
  }) => {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/matrix/computation/fix-matrix`,
      headers: {
        "x-auth-deviceid": "1",
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: {
        origin,
        destination,
        declaredValue,
        parcelCount,
        fixMatrixItemName,
        quantity,
        additionalFee,
        discountName,
        cargoType,
      },
    });
  },

  getExcessBaggageStatus: ({ origin, destination, cargoType }) => {
    return axios({
      method: "post",
      url: `${BASE_URL}/api/v1/account/delivery-person/matrix/computation/excess-cargo/status`,
      headers: {
        "x-auth-deviceid": "1",
        "x-auth-devicetype": config.header.deviceType,
        "x-auth-token": userProfileObject.getToken(),
      },
      data: {
        origin,
        destination,
        cargoType,
      },
    });
  },
};

export default ParcelService;
