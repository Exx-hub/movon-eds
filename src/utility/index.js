import {notification} from 'antd';
import { ERROR_CODES} from '../config'

// export const useWindowSize = () =>{
//     const isClient = typeof window === 'object';
  
//     function getSize() {
//       return {
//         width: isClient ? window.innerWidth : undefined,
//         height: isClient ? window.innerHeight : undefined
//       };
//     }
  
//     const [windowSize, setWindowSize] = useState(getSize);
  
//     useEffect(() => {
//       if (!isClient) {
//         return false;
//       }
      
//       function handleResize() {
//         setWindowSize(getSize());
//       }
  
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }, []); // Empty array ensures that effect is only run on mount and unmount
  
//     return windowSize;
// }

export const dataURLtoFile = (dataurl, filename) => {
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

export const getCredential = () =>{
  const credential = localStorage.getItem('credential') || null;
  return JSON.parse(credential)
}

export const setCredential = (data) =>{
  localStorage.setItem('credential',JSON.stringify(data)) 
}

export const getToken = () =>{
  let token = null
  const credential = localStorage.getItem('credential') || null;
  if(credential){
    token = (JSON.parse(credential)).token
  }
  return token
}

export const getUser = () =>{
  try {
    let user = null
    const credential = localStorage.getItem('credential') || undefined;
    if(credential){
      user = JSON.parse(credential).user
      return user ? user : null;
    }
  } catch (error) {
    return null
  }
}


export class UserProfile{

  user = undefined
  credential = undefined;
  token = undefined
  busCompany = undefined

  constructor(){
    if(localStorage.getItem('credential')){
      this.credential = JSON.parse(localStorage.getItem('credential'));
    }
    if(this.credential){
      console.log(this.credential)
      this.token = this.credential.token;
      this.user = this.credential.user;
    }  
  }

  logout(User){
    User.logout(this.token)
    .then(this.clearData())
    .catch(this.clearData());
  }

  clearData(){
    localStorage.setItem('credential',null)
    this.token = null;
    this.user = null;
    this.credential = null
  }

  getToken(){
    return this.token
  }

  getAssignedStation(){
    if(this.user){
      const {_id, name}=this.user.assignedStation
      return { _id, name }
    }
    return undefined;
  }

  getBusCompany(){
    if(this.user){
      return this.user.busCompanyId
    }
    return undefined;
  }

  getBusCompanyTag(){
    if(this.getBusCompany()){
      let tag = this.getBusCompany().tag || ((this.getBusCompany().config.parcel && this.getBusCompany().config.parcel.tag) || undefined  )
      return tag ? tag.toLowerCase() : undefined
    }
    return undefined;
  }

  isIsarogLiners(){
    if(this.getBusCompanyTag()){
      console.log("tag====>>",this.getBusCompanyTag().toLowerCase())
      return "isarog-liner" === this.getBusCompanyTag().toLowerCase();
    }
    return false;
  }

  isFiveStar(){
    if(this.getBusCompanyTag()){
      return "five-star" === this.getBusCompanyTag().toLowerCase();
    }
    return false;
  }


}

export const clearCredential = () =>{
  localStorage.setItem('credential',null) 
}

 /**
    @param {string} type - success, info, warning, error
    @param {number} code - 000
  */

 export const openNotificationWithIcon = (type, code, func) => {
  console.log('[UTILITY]:erroCode',code)

  const erCode = (ERROR_CODES && ERROR_CODES[code]) || undefined;
  const msg = (erCode && erCode.message) || undefined;
  const desc = (erCode && erCode.description) || undefined;
  
  notification[type]({
    onClose: func || null,
    message: msg || "Something went wrong",
    description: desc || "Something went wrong",
  });
};

export const openNotificationWithDuration = (type, code, func) => {
  notification[type]({
    duration:5,
    onClose: func || null,
    message: ERROR_CODES[code].message || "Configure Failed",
    description: ERROR_CODES[code].description || "setup you mesage to config",
  });
};

export const openNotification = (type, {title, message}) => {
  notification[type]({
    message: title,
    description: message,
  });
};

export const debounce = (func, wait) => {
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

export const alterPath = (path, props) =>{
  console.log('process.env.NODE_ENV',process.env.NODE_ENV)
  //return process.env.NODE_ENV === 'development' ? '/staging' + path : path;
  return path;
}

export const modifyName = fullName =>{
  fullName = fullName.toLowerCase();
  const i = fullName.split(" ")
  return i.map(name=>{
      return name.charAt(0).toUpperCase() + name.slice(1) + " "
  })
}
  