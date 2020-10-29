import axios from 'axios';
import Config from '../util/Config';

const Scan = {
    scanCode : (scanCode, tripId, scanType) => {
        return axios({
            method: 'post',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/scan`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : Config.api_token
            },
            data: {
                scanCode: scanCode,
                tripId: tripId,
                scanType: scanType
            }
        })
    },

    scanSubParcel : (subParcelIds) => {
        return axios({
            method: 'post',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/subParcelTagging`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : Config.api_token
            },
            data: {
                subParcelId: subParcelIds
            }
        })
    },

    verifyClaimOTP : (parcelId, otp) => {
        return axios({
            method: 'post',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/{parcelId}/verify-claim-otp`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : Config.api_token
            },
            data: {
                parcelId: parcelId,
                otp: otp
            }
        })
    }
}

export default Scan
