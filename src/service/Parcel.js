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

    create : (state) => {
        const{
            details, checkIn, packageImagePreview, selectedTrip, billOfLading,
        }=state;
      
        const {
            senderName,
            senderMobile,
            senderEmail,
            recieverName,
            recieverMobile,
            recieverEmail,
            destination,
            description,
            declaredValue,
            quantity,
            systemFee,
            additionNote,
            packageInsurance,
            type,
            packageWeight,
            shippingCost,
            totalShippingCost,
        } = details;

        const COUNTRY_CODE= "PH";
        const CARGO_PADALA= 3;
        const PACKAGE_INSURANCE = 0;

        const bodyFormData = new FormData();
        bodyFormData.set('senderName',senderName.value)
        bodyFormData.set('senderEmail', senderEmail.value || "")
        bodyFormData.set('senderPhoneCountryCode', COUNTRY_CODE)
        bodyFormData.set('senderPhoneNumber', senderMobile.value)
        bodyFormData.set('recipientName', recieverName.value)
        bodyFormData.set('recipientEmail', recieverEmail.value || "")
        bodyFormData.set('recipientPhoneCountryCode', COUNTRY_CODE)
        bodyFormData.set('recipientPhoneNumber',recieverMobile.value)
        bodyFormData.set('packageName', description.value)
        bodyFormData.set('packageWeight',packageWeight.value)
        bodyFormData.set('estimatedValue', declaredValue.value)
        bodyFormData.set('accompanied', type.value !== CARGO_PADALA)
        bodyFormData.set('packageInsurance', PACKAGE_INSURANCE)
        bodyFormData.set('quantity', quantity.value)
        bodyFormData.set('price', shippingCost.value)
        bodyFormData.set('additionalNote', additionNote.value)
        bodyFormData.append('packageImage', packageImagePreview)
        bodyFormData.set('busId', selectedTrip.bus.busId)
        bodyFormData.set('busCompanyId', selectedTrip.busCompanyId._id)
        bodyFormData.set('tripId', selectedTrip._id)
        bodyFormData.set('startStation', selectedTrip.startStation._id)
        bodyFormData.set('endStation', selectedTrip.endStation._id)
        bodyFormData.set('checkIn', checkIn)
        bodyFormData.set('convenienceFee', systemFee.value)
        bodyFormData.set('insuranceFee', packageInsurance.value)
        bodyFormData.set('billOfLading', billOfLading.value)
                
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
                    isAccompanied: type !== 3,
                    paxNumber: type === 3 ? 0 : paxNumber,
                }
            })
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