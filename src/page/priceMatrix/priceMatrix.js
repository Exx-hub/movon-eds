import React, { useEffect, useState } from 'react';
import DltbMatrix from './dltbMatrix'
import RoutesService from "../../service/Routes";
import MatrixService from "../../service/Matrix";
import { UserProfile } from '../../utility';
import { config } from '../../config';


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
    const _endStationRoutes = data
    .filter((e) => e.start === startStationId)
    .map((e) => ({ stationId: e.end, stationName: e.endStationName }))

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

const FIX_PRICE_FORMAT = {
    name:"No Data",
    price:0,
    declaredValue:0,
}

const initState ={
    originList:[],
    getEndStations,
    getMatrix,
    FIX_PRICE_FORMAT
}

function PriceMatrix(props){

    const [state,setState] = useState(initState)

    useEffect(()=>{
        RoutesService.getAllRoutes()
        .then((e) => {
            //console.info('getAllRoutes',e)
            const { data, errorCode } = e.data;
            if (errorCode) {
              console.info('error',errorCode)
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

    // const getContainer = () =>{
    //     let view = undefined;
    //     switch(props.tag){
    //         case "dltb" : break;
    //         default: break;
    //     }
    // }
    
    return(
        <DltbMatrix data={{...state}} {...props} />
    )
}

export default PriceMatrix;