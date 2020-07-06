import axios from 'axios';
import {config} from '../config';
import {getToken} from '../utility'

const BASE_URL = config.BASE_URL;

const ManifestService = {
    getRoutes: () => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifestOutboundStations`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    },

    getAvailableManifest: (startStation, endStation) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest/${startStation}/${endStation}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    },

    getManifest: (endTripDate, startTripDate, startStation, endStation, page) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest/${endTripDate}/${startTripDate}/${startStation}/${endStation}/${page}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    },

    getPackages: (tripId) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest-parcel-list/${tripId}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    },
    
    checkInNewParcel: (tripId) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/board-all-parcel/${tripId}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    }
}

export default ManifestService;