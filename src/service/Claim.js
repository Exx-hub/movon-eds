import axios from 'axios';
import Config from '../util/Config';

const Claim = {
    getTrips: () => {
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/claim-trip-list`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : Config.api_token
            }
        })
    },

    getPackages: (tripId) => {
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/claim-parcel-list/${tripId}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : Config.api_token
            },
            
        })
    },

    confirmClaim: (claimData) => {
        const bodyFormData = new FormData();

        bodyFormData.set('parcelId',claimData.parcelId);
        bodyFormData.set('parcelImage',claimData.parcelImage);

        return axios({
            method: 'post',
            url:`${Config.api_domain}/api/v1/account/delivery-person/parcel/{parcelId}/confirm-claim`,
            data: bodyFormData,
            config: { headers : {'Content-Type': 'multipart/form-data'} }
        })
    }

}

export default Claim