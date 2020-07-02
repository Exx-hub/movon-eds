import axios from 'axios';
import Config from '../util/Config';

const ManifestService = {
    getRoutes: () => {
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/manifestOutboundStations`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : Config.api_token
            }
        })
    },

    getManifest: (startTripDate, startStation, endStation, page) => {
        console.log('getManifest url',`${Config.api_domain}/api/v1/account/delivery-person/parcel/manifest/${startTripDate}/${startStation}/${endStation}/${page}`,
        )
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/manifest/${startTripDate}/${startStation}/${endStation}/${page}`,
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
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/manifest-parcel-list/${tripId}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : Config.api_token
            }
        })
    },
    
    checkInNewParcel: (tripId) => {
        return axios({
            method: 'get',
            url: `${Config.api_domain}/api/v1/account/delivery-person/parcel/board-all-parcel/${tripId}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : Config.api_token
            }
        })
    }
}

export default ManifestService;