import axios from 'axios';
import {config} from '../config';
import {UserProfile} from '../utility'

const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile

const TransactionService = {
    getAllTransaction: (search,page,limit) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/cargo-transaction/pull/list`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params:{
                search,
                page,
                limit
            }
        })
    },
    getTransactionsByStatus: (search,page,limit,status) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/transaction`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params: {
                search,
                page,
                limit,
                status
            }
        })
    },
    voidParcel: ( billOfLading, parcelId, remarks) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/transaction/
            `,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data:{
                deliveryPersonId: UserProfile.getUser()._id,
                status: 2,
                billOfLading,
                parcelId,
                remarks,
                type: 1
             }
             
        })
    },
    acceptVoid: (parcelId) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/transaction/approve
            `,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data:{
                parcelId
             }
             
        })
    },
    rejectVoid: (parcelId,rejectReason) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/transaction/reject
            `,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data:{
                parcelId,
                rejectReason
             }
             
        })
    },
}

export default TransactionService;
