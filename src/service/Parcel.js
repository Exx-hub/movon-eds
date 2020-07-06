import axios from 'axios';
import moment from 'moment';
import {config} from '../config';
import {getToken} from '../utility'

const BASE_URL = config.BASE_URL;

const ParcelService = {
    getTrips : (stationId) => {

        var currentTime = moment().utc().format('YYYY-MM-DDThh:mm:ss[Z]')
        var todaysStartDate = moment().startOf('day').format('YYYY-MM-DDThh:mm:ss[Z]');
        var tomorrowsStartTime = moment().add(1,'d').startOf('day').format('YYYY-MM-DDThh:mm:ss[Z]');

        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/home/trips`,
            headers : {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            },
            data : {
                stationId: stationId,
                //todaysStartDate: moment().subtract(1,'day').format('YYYY-MM-DDThh:mm:ss[Z]'),
                //tomorrowsStartTime: moment().add(1,'day').format('YYYY-MM-DDThh:mm:ss[Z]'),
                //currentTime: moment().format('YYYY-MM-DDThh:mm:ss[Z]')
                todaysStartDate,
                tomorrowsStartTime,
                currentTime
            }
        })
    },

    create : (parcelData) => {

        console.log('create state params',parcelData)
        const bodyFormData = new FormData();
        const packageName = (parcelData.packageName === 'Others' ? `Others -  ${parcelData.packageNameOpt}` : parcelData.packageName)

        bodyFormData.set('senderName',parcelData.senderName)
        bodyFormData.set('senderEmail', parcelData.senderEmail)
        bodyFormData.set('senderPhoneCountryCode', parcelData.senderPhoneCountryCode)
        bodyFormData.set('senderPhoneNumber', parcelData.senderPhoneNumber)
        bodyFormData.set('recipientName', parcelData.recipientName)
        bodyFormData.set('recipientEmail', parcelData.recipientEmail)
        bodyFormData.set('recipientPhoneCountryCode', parcelData.recipientPhoneCountryCode)
        bodyFormData.set('recipientPhoneNumber', parcelData.recipientPhoneNumber)
        // bodyFormData.set('packageName', parcelData.packageName)
        bodyFormData.set('packageName', packageName)
        bodyFormData.set('packageWeight', parcelData.packageWeight)
        bodyFormData.set('estimatedValue', parcelData.estimatedValue)
        bodyFormData.set('accompanied', parcelData.accompanied)
        bodyFormData.set('packageInsurance', parcelData.packageInsurance)
        bodyFormData.set('quantity', parcelData.quantity)
        bodyFormData.set('price', parcelData.price)
        bodyFormData.set('additionalNote', parcelData.additionalNote)
        bodyFormData.append('packageImage', parcelData.packageImage)
        bodyFormData.set('busId', parcelData.busId)
        bodyFormData.set('busCompanyId', parcelData.busCompanyId)
        bodyFormData.set('tripId', parcelData.tripId)
        bodyFormData.set('startStation', parcelData.startStation)
        bodyFormData.set('endStation', parcelData.endStation)
        bodyFormData.set('checkIn', parcelData.checkIn)
        bodyFormData.set('convenienceFee', parcelData.convenienceFee)
        bodyFormData.set('insuranceFee', parcelData.insuranceFee)
        bodyFormData.set('billOfLading', parcelData.billOfLading)
                
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/create`,
            headers : {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            },
            data: bodyFormData,
            config: { headers : {'Content-Type': 'multipart/form-data'} }
        })
    },

    getDynamicPrice: (busCompanyId, claimAmount, endStation, type, paxNumber ,startStation, weight) => {
        if(busCompanyId, claimAmount, endStation, type, paxNumber ,startStation, weight){
            console.log('call the API------>>>getDynamicPrice')
            let accompaniedValue = ''
            switch (type) {
                case 2:
                    accompaniedValue = "Excess Non AC"
                    break;
                case 3:
                    accompaniedValue = "Cargo Padala"
                    break;
                default:
                    accompaniedValue = "Excess AC"
                    break;
            }

            console.log('service getDynamicPrice',type)

            return axios({
                method: 'post',
                url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/calculate`,
                headers: {
                    'x-auth-deviceid' : '1',
                    'x-auth-devicetype' : '1',
                    'x-auth-token' : getToken()
                },
                data: {
                    claimAmount,
                    endStation,
                    type,
                    startStation,
                    weight,
                    accompaniedValue,
                    isAccompanied: type != 3,
                    paxNumber: type == 3 ? 0 : paxNumber,
                }
            })
        }
    },

    getConvenienceFee: (quantity) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/parcel-convenience-fee/${quantity}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : '1',
                'x-auth-token' : getToken()
            }
        })
    }
}

export default ParcelService;