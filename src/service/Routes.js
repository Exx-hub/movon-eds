import axios from 'axios';
import {config} from '../config';
import {UserProfile} from '../utility'

const Routes = {
    getAllRoutes: () => {
        return axios({
            method: 'get',
            url: `${config.BASE_URL}/api/v1/account/delivery-person/routes/${UserProfile.getBusCompanyTag()}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : UserProfile.getToken()
            }
        })
    },
}
export default Routes