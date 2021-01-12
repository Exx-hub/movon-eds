import React, { useEffect, useState } from 'react';
import { notification } from "antd";
import DltbMatrix from './dltbMatrix'
import DefaultMatrix from './orig.priceMatrix'
import RoutesService from "../../service/Routes";
import MatrixService from "../../service/Matrix";
import { UserProfile, openNotificationWithIcon } from "../../utility";


const getStartStations = (data) =>{
    let clean = []; 
    const _startStationRoutes = data
    .map((e) => ({ stationId: e.start, stationName: e.startStationName }))
    .filter((e) => {
      if (!clean.includes(e.stationName)) {
        clean.push(e.stationName);
        return true;
      }
      return false;
    });
    return [..._startStationRoutes]
}

const getMatrix = async(originId,destinationId) =>{
    const result = await MatrixService.getMatrix({
        busCompanyId: UserProfile.getBusCompanyId(),
        origin:originId,
        destination: destinationId,
    })
    return result;
}

const getEndStations = (startStationId, data) =>{
  let unique = []
    const _endStationRoutes = data
    .filter((e) => e.start === startStationId)
    .map((e) => ({ stationId: e.end, stationName: e.endStationName }))
    .filter(e=>{
      if(!unique.includes(e.stationName)){
        unique.push(e.stationName)
        return true
      }
      return false
    })
    _endStationRoutes.sort(function(a, b) {
  var nameA = a.stationName.toUpperCase(); // ignore upper and lowercase
  var nameB = b.stationName.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
});

    return _endStationRoutes
}

const getAllRoutesByOrigin = async(originId) =>{
  try {
    const result = await RoutesService.getAllRoutesByOrigin(originId);
    console.info('result',result)
    const{data,success,errorCode}=result.data;
    if(!errorCode){
      let unique=[]
      let _data = data.filter(e=>{
        if(!unique.includes(e.endStationName)){
          unique.push(e.endStationName)
          return true
        }
        return false;
      })
      _data.sort(function(a, b) {
        var nameA = a.endStationName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.endStationName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
      return Promise.resolve(_data)
    }
    return Promise.reject(false)
    
  } catch (error) {
    
  }
}

const FIX_PRICE_FORMAT = {
    name:"No Data",
    price:0,
    declaredValue:0,
}

const MatrixObjects={
  "dltb":{
    destination:"",
    dvRate:0,
    addRate:0,
    basePrice:0,
    handlingFee:0,
    weightRate:0,
    allowableWeight:0,
    minDeclaredValue:0,
    insuranceFee:0,
    isShortHaul:1,
    maxDeclaredValue:0
  },
  "isarog-liner":{
    declaredValueRate: 0,
    exceededPerKilo: 0,
    maxAllowedLength:["1", "2"],
    maxAllowedLengthRate:["5", "8"],
    maxAllowedWeight: 0,
    price: 0,
    tariffRate: 0
  }
}


function PriceMatrix(props){

  const handleErrorNotification = (code) => {
    if (!code) {
      notification["error"]({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }
  
    if (code === 1000) {
      openNotificationWithIcon("error", code);
      UserProfile.clearData();
      props.history.push("/");
      return;
    }
    openNotificationWithIcon("error", code);
  };

    const [state,setState] = useState({
      MatrixObjects,
      FIX_PRICE_FORMAT,
      originList:[],
      getEndStations,
      getMatrix,
      getAllRoutesByOrigin,
      handleErrorNotification
    })

    useEffect(()=>{
        RoutesService.getAllRoutes()
        .then((e) => {
            const { data, errorCode } = e.data;
            if (errorCode) {
              handleErrorNotification(errorCode)
              return;
            }
            setState( prevState =>{
                return {
                    ...prevState,
                    routes:data,
                    originList: getStartStations(data)
                }
            })
          })
    },[])

    const getContainer = () =>{
        let  view = undefined;
        switch(UserProfile.getBusCompanyTag()){
            case "isarog-liner" : 
              view = <DefaultMatrix {...props} />
              break;
            case "dltb" : 
              view = <DltbMatrix data={{...state}} {...props} />
              break;
            default: break;
        }
        return view
    }
    return(<> {getContainer()}</>)
}

export default PriceMatrix;