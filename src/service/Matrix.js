import axios from 'axios';
import {config} from '../config';
import {UserProfile} from '../utility'

const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile

const MatrixService = {
    create: (data) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/upsert/tariff-matrix`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data
        })
    },

    getMatrix: (params) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/pull/tariff-matrix`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params:{
                busCompanyId:params.busCompanyId,
                origin:params.origin,
                destination:params.destination
            }
        })
    },

    getMatrixComputation: (params) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/compute/tariff-matrix`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params:{
                origin:params.origin,
                destination:params.destination,
                declaredValue:params.declaredValue,
                weight:params.weight,
                length:params.length
            }
        })
    },

    onConnectingRoutesComputation: (busCompanyId, origin, destination, weight, declaredValue) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/associate/compute/tariff-matrix`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data:{
                busCompanyId, origin, destination, weight, declaredValue
            }
        })
    },

    
}

export default MatrixService;
