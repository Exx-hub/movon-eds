import {useEffect,useState} from 'react';
import {notification} from 'antd';
import {config, ERROR_CODES} from '../config'


export const useWindowSize = () =>{
    const isClient = typeof window === 'object';
  
    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }
  
    const [windowSize, setWindowSize] = useState(getSize);
  
    useEffect(() => {
      if (!isClient) {
        return false;
      }
      
      function handleResize() {
        setWindowSize(getSize());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount
  
    return windowSize;
}

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
  let user = null
  const credential = localStorage.getItem('credential') || null;
  if(credential){
    user = (JSON.parse(credential)).user
  }
  return user
}

export const clearCredential = () =>{
  localStorage.setItem('credential',null) 
}

 /**
    @param {string} type - success, info, warning, error
    @param {number} code - 000
  */

 export const openNotificationWithIcon = (type, code, func) => {
    console.log('[UTILITY]:openNotificationWithIcon code',code)
    notification[type]({
      duration:0,
      onClose: func || null,
      message: ERROR_CODES ? ERROR_CODES[code].message : "Something went wrong",
      description: ERROR_CODES ? ERROR_CODES[code].description : "Something went wrong",
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
  