import axios from 'axios';
import {config} from '../config';

const BASE_URL = config.BASE_URL;

const Transaction = {
  changeTransaction: (status, deliveryPersonId, parcelId, remarks, type) => {
    return axios({
      method: 'post',
      url: `${BASE_URL}/api/v1/account/delivery-person/parcel/cargo-transaction/update/status`,
      headers: {
        'x-auth-deviceid' : config.header.deviceId,
        'x-auth-devicetype' : config.header.deviceType,
        'x-auth-token' : config.api_token
      },
      data: { status, deliveryPersonId, parcelId, remarks, type }
    })
  }
}

export default Transaction
