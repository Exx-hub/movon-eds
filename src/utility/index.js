import { notification } from "antd";
import { ERROR_CODES } from "../config";
import UserProfileClass from "./userprofile";
import MovonLogo from "../assets/movon.png";
import FiveStar from "./busCompanies/fivestar";
import IsarogLogobw from "../assets/bicol-isarog-bw-png.png";
import IsarogLogo from "../assets/bicol-isarog-png.png";
import FiveStarLogobw from "../assets/five-star-bw-png.png";
import DltbLogobw from "../assets/dltb-bw-png.png";
import DltbLogo from "../assets/dltb-png.png";
import FiveStarLogo from "../assets/five-star-png.png";

const UserProfile = new UserProfileClass();

const dataURLtoFile = (dataurl, filename) => {
  if (dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  return null;
};

const openNotificationWithIcon = (type, code, func) => {
  const erCode = (ERROR_CODES && ERROR_CODES[code]) || undefined;
  const msg = (erCode && erCode.message) || undefined;
  const desc = (erCode && erCode.description) || undefined;

  notification[type]({
    onClose: func || null,
    message: msg || "Something went wrong",
    description: desc || "Something went wrong",
  });
};

const openNotificationWithDuration = (type, code, func) => {
  notification[type]({
    duration: 5,
    onClose: func || null,
    message: ERROR_CODES[code].message || "Configure Failed",
    description: ERROR_CODES[code].description || "setup you mesage to config",
  });
};

const openNotificationWithDurationV2 = (type, title, description, func) => {
  notification[type]({
    onClose: func || null,
    message: title || "Something went wrong",
    description: description || "setup you mesage to config",
  });
};

const openNotification = (type, { title, message }) => {
  notification[type]({
    message: title,
    description: message,
  });
};

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const alterPath = (path, props) => {
  //return process.env.NODE_ENV === 'development' ? '/staging' + path : path;
  return path; //"/cargo"+path;
};

const modifyName = (fullName) => {
  fullName = fullName.toLowerCase();
  const i = fullName.split(" ");
  return i.map((name) => {
    return name.charAt(0).toUpperCase() + name.slice(1) + " ";
  });
};

// const getStickerLogoBw = () =>{
//   let logo = undefined;
//   switch (UserProfile.getBusCompanyTag()) {
//     case 'isarog-liner':
//       logo = IsarogLogobw
//       break;

//     case 'five-star':
//       logo = FiveStarLogobw
//       break;

//     case 'dltb':
//       logo = DltbLogobw
//       break;

//     default:
//       logo = MovonLogo
//       break;
//   }
//   return logo
// }
const getHeaderContainer = () => {
  let color = getHeaderColor();
  switch (UserProfile.getBusCompanyTag()) {
    case "isarog-liner":
      color = "#1d7ab2";
      break;

    default:
      color = "rgb(204, 39, 40)";
      break;
  }
  return color;
};
const getHeaderColor = () => {
  let color = undefined;
  switch (UserProfile.getBusCompanyTag()) {
    case "isarog-liner":
      color = "#fff"; //"#1d7ab2"
      break;

    case "five-star":
      color = "#fff";
      break;

    case "dltb":
      color = "#fff";
      break;

    default:
      color = "#fff";
      break;
  }
  return color;
};

const getStickerLogoBw = () => {
  let logo = undefined;
  switch (UserProfile.getBusCompanyTag()) {
    case "isarog-liner":
      logo = IsarogLogobw;
      break;

    case "five-star":
      logo = FiveStarLogobw;
      break;

    case "dltb":
      logo = DltbLogobw;
      break;

    default:
      logo = MovonLogo;
      break;
  }
  return logo;
};

const getHeaderLogo = () => {
  let logo = undefined;
  switch (UserProfile.getBusCompanyTag()) {
    case "isarog-liner":
      logo = IsarogLogo;
      break;

    case "five-star":
      logo = FiveStarLogo;
      break;

    case "dltb":
      logo = DltbLogo;
      break;

    default:
      logo = UserProfile.getBusCompanyLogo();
      break;
  }
  return logo;
};

const getCashierTextColor = () => {
  let color = undefined;
  switch (UserProfile.getBusCompanyTag()) {
    case "isarog-liner":
    case "five-star":
    case "dltb":
      color = "gray";
      break;

    default:
      color = "gray";
      break;
  }
  return color;
};

export {
  modifyName,
  alterPath,
  debounce,
  openNotification,
  openNotificationWithDuration,
  openNotificationWithDurationV2,
  openNotificationWithIcon,
  UserProfile,
  dataURLtoFile,
  FiveStar,
  getStickerLogoBw,
  getHeaderLogo,
  getCashierTextColor,
  getHeaderColor,
  getHeaderContainer,
};
