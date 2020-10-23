import axios from 'axios';
import {config} from '../config';
import {getToken,UserProfile} from '../utility'

const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile()

const MatrixService = {
    create: (data) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/matrix`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : userProfileObject.getToken()
            },
            data
        })
    },
    getMatrix: (params) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/matrix?busCompanyId=${params.busCompanyId}&origin=${params.origin}&destination=${params.destination}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : userProfileObject.getToken()
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
        console.log('passs sevice----->>>>')
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/matrix/connecting-routes/computation`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : userProfileObject.getToken()
            },
            data:{
                busCompanyId, origin, destination, weight, declaredValue
            }
        })
    },
}

export default MatrixService;