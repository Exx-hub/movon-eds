import {notification} from 'antd';
import { ERROR_CODES} from '../config'
import UserProfileClass from './userprofile'
import MovonLogo from '../assets/movoncargo.png'
import FiveStar from './busCompanies/fivestar'
import IsarogLogobw from '../assets/bicol-isarog-bw-png.png'
import FiveStarLogobw from '../assets/five-star-bw-png.png'
import DltbLogobw from '../assets/dltb-bw-png.png';

const UserProfile = new UserProfileClass();

const dataURLtoFile = (dataurl, filename) => {
  if(dataurl){
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }
  return null;
}

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
    duration:5,
    onClose: func || null,
    message: ERROR_CODES[code].message || "Configure Failed",
    description: ERROR_CODES[code].description || "setup you mesage to config",
  });
};

const openNotification = (type, {title, message}) => {
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

const alterPath = (path, props) =>{
  //return process.env.NODE_ENV === 'development' ? '/staging' + path : path;
  return path //"/cargo"+path;
}

const modifyName = fullName =>{
  fullName = fullName.toLowerCase();
  const i = fullName.split(" ")
  return i.map(name=>{
      return name.charAt(0).toUpperCase() + name.slice(1) + " "
  })
}
const getStickerLogoBw = () =>{
  let logo = undefined;
  switch (UserProfile.getBusCompanyTag()) {
    case 'isarog-liner':
      logo = IsarogLogobw
      break;

    case 'five-star':
      logo = FiveStarLogobw
      break;

    case 'dltb':
      logo = DltbLogobw
      break;
  
    default:
      logo = MovonLogo
      break;
  }
  return logo
}

export{
  modifyName, 
  alterPath, 
  debounce, 
  openNotification, 
  openNotificationWithDuration, 
  openNotificationWithIcon,
  UserProfile, 
  dataURLtoFile,
  FiveStar,
  getStickerLogoBw
}
  