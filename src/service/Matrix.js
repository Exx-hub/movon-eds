import axios from 'axios';
import moment from 'moment';
import {config} from '../config';
import {getToken} from '../utility'

const BASE_URL = config.BASE_URL;

const MatrixService = {
    create: (data) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/matrix`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            },
            data
        })
    },
    getMatrix: (params) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/matrix?origin=${params.origin}&destination=${params.destination}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    },
    getMatrixComputation: (params) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/matrix-computation`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            },
            params:{
                origin:params.origin,
                destination:params.destination,
                declaredValue:params.declaredValue,
                weight:params.weight,
                lenght:params.lenght
            }
        })
    },
}

export default MatrixService;