import axios from 'axios';
import {config} from '../config';
import {getToken,UserProfile} from '../utility'

const BASE_URL = config.BASE_URL;

const User = {
    login : (staffId,password) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/delivery-person/auth/login`,
            data: {
                staffId: staffId, 
                password: password
            },
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType
            }
        })
    },

    logout : () => {
        return axios({
            method: 'put',
            url: `${BASE_URL}/api/v1/account/delivery-person/home/logout`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : UserProfile.getToken()
            }
        })
    },

    validateToken : () => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/token/`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : UserProfile.getToken()
            }
        })
    }
}

export default User;
