import axios from 'axios';
import {config} from '../config';
import {getToken, UserProfile} from '../utility'

const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile

const ManifestService = {
    getRoutes: () => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifestOutboundStations`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getAvailableManifest: (startStation, endStation, limit) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest/${startStation}/${endStation}/${limit}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getManifestDateRange: (startTripDate, endTripDate, startStation, endStation, page, limit) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest/range/${startTripDate}/${endTripDate}/${startStation}/${endStation}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params:{page, limit}
        })
    },

    getManifest: (startTripDate, startStation, endStation, page) => {
    
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest/${startTripDate}/${startStation}/${endStation}/${page}`,
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
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest-parcel-list/${tripId}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },
    
    checkInNewParcel: (tripId) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/board-all-parcel/${tripId}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getManifestByDate: (tripId, date, startStation, endStation) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/manifest/by-date?date=${date}&startStation=${startStation}&endStation=${endStation}`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params:{
                tripId
            }
        })
    },

    checkParcelById: (parcelId) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/update-status`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data:{
                parcelId
            }
        })
    },
    arriveAllParcel: (tripId) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${tripId}/arrived`,
            headers: {
                'x-auth-deviceid' : config.header.deviceId,
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    

}

export default ManifestService;
