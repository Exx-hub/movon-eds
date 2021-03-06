import axios from 'axios';
import Config from '../util/Config';

const Receive ={
    getTrips: () => {
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/receive-trip-list`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : Config.api_token
            }
        })
    },

    getPackages: (tripId) => {
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/receive-parcel-list/${tripId}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : Config.api_token
            }
        })
    }
}

export default Receive
