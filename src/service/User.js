import axios from 'axios';
import {config} from '../config';

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
                'x-auth-devicetype' : '1'
            }
        })
    },

    logout : (token) => {
        return axios({
            method: 'put',
            url: `${BASE_URL}/api/v1/account/delivery-person/home/logout`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : token
            }
        })
    },

    validateToken : (token) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/token/`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : token
            }
        })
    }
}

export default User;