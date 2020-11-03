import axios from 'axios';
import {config} from '../config';
import {UserProfile} from '../utility'

const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile;

const Claim = {
    getTrips: () => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/claim-trip-list`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getPackages: (tripId) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/claim-parcel-list/${tripId}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            
        })
    },

    confirmClaim: (claimData) => {
        const bodyFormData = new FormData();

        bodyFormData.set('parcelId',claimData.parcelId);
        bodyFormData.set('parcelImage',claimData.parcelImage);

        return axios({
            method: 'post',
            url:`${BASE_URL}/api/v1/account/delivery-person/parcel/{parcelId}/confirm-claim`,
            data: bodyFormData,
            config: { headers : {'Content-Type': 'multipart/form-data'} }
        })
    }

}

export default Claim
