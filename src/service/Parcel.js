import axios from 'axios';
import moment from 'moment';
import { config } from '../config';
import {UserProfile} from '../utility'
import { ConfigConsumer } from 'antd/lib/config-provider';

const BASE_URL = config.BASE_URL;
const userProfileObject = UserProfile;

const ParcelService = {
    getTrips : (stationId) => {

       // var currentTime = moment().utc().format('YYYY-MM-DDThh:mm:ss[Z]')
        //var todaysStartDate = moment().startOf('day').format('YYYY-MM-DDThh:mm:ss[Z]');
        //var tomorrowsStartTime = moment().add(1,'d').startOf('day').format('YYYY-MM-DDThh:mm:ss[Z]');

        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/home/trips`,
            headers : {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data : {
                //stationId: stationId,
                todaysStartDate: moment().subtract(1,'day').format('YYYY-MM-DDThh:mm:ss[Z]'),
                tomorrowsStartTime: moment().add(1,'day').format('YYYY-MM-DDThh:mm:ss[Z]'),
                currentTime: moment().format('YYYY-MM-DDThh:mm:ss[Z]')
                //todaysStartDate,
                //tomorrowsStartTime,
                //currentTime
            }
        })
    },

    create : (state) => {

        const{
            details,
            checkIn,
            packageImagePreview,
            selectedTrip,
            billOfLading,
            tariffRate,
        }=state;

        const {
            senderName,
            senderMobile,
            senderEmail,
            recieverName,
            recieverMobile,
            recieverEmail,
            description,
            declaredValue,
            quantity,
            sticker_quantity,
            systemFee,
            additionNote,
            packageInsurance,
            type,
            packageWeight,
            shippingCost,
            length,
            connectingCompanyComputation,
            connectingCompany,
            connectingRoutes,
            totalShippingCost,
            associateORNumber,
            busNumber,
            tripCode,
            driverFullName,
            conductorFullName,
        } = details;

        const associatedTariffRate = tariffRate || undefined;
        const associatedDestination = connectingRoutes.value || undefined 
        const associatedCompanyId = connectingCompany.value || undefined
        const associatedOrigin = (connectingRoutes.options.length>0 && connectingRoutes.options.filter(e=>e.end)[0].start) || undefined;
        const associatedAmount = connectingCompanyComputation;

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
        bodyFormData.set('sticker_quantity', sticker_quantity.value || 0)
        bodyFormData.set('quantity', quantity.value || 0)
        bodyFormData.set('price', shippingCost.value || 0)
        bodyFormData.set('additionalNote', additionNote.value)
        bodyFormData.append('packageImage', packageImagePreview)
        bodyFormData.set('busId', selectedTrip.busId)
        bodyFormData.set('busCompanyId', selectedTrip.companyId)
        bodyFormData.set('tripId', selectedTrip.tripsId)
        bodyFormData.set('startStation', selectedTrip.startStationId)
        bodyFormData.set('endStation', selectedTrip.value)
        bodyFormData.set('checkIn', checkIn)
        bodyFormData.set('convenienceFee', systemFee.value || 0)
        bodyFormData.set('insuranceFee', packageInsurance.value || 0)
        bodyFormData.set('billOfLading', billOfLading.value)
        bodyFormData.set('associatedTariffRate', associatedTariffRate || 0)
        bodyFormData.set('associatedCompanyId', associatedCompanyId)
        bodyFormData.set('associatedOrigin', associatedOrigin)
        bodyFormData.set('associatedDestination', associatedDestination)
        bodyFormData.set('associatedAmount', associatedAmount)
        bodyFormData.set('parcel_length', (length && length.value) || 0)
        bodyFormData.set('totalShippingCost',totalShippingCost.value || 0)
        bodyFormData.set('busNumber',busNumber.value)
        bodyFormData.set('tripCode',tripCode.value)
        bodyFormData.set('driverFullName',driverFullName.value)
        bodyFormData.set('conductorFullName',conductorFullName.value)
        bodyFormData.set('associateORNumber', associateORNumber.value)

        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/create`,
            headers : {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data: bodyFormData,
            config: { headers : {'Content-Type': 'multipart/form-data'} }
        })
    },

    getDynamicPrice: (busCompanyId, claimAmount, endStation, type, paxNumber ,startStation, weight, length) => {
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

            return axios({
                method: 'post',
                url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/calculate`,
                headers: {
                    'x-auth-deviceid' : '1',
                    'x-auth-devicetype' : config.header.deviceType,
                    'x-auth-token' : userProfileObject.getToken()
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
                    parcel_length: length
                }
            })
    },

    getFareMatrix:(busCompanyId, declaredValue, weight, origin, destination) => {
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/calculate-by-matrix/`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            data: {
                declaredValue,
                weight,
                origin,
                destination
            }
        })
    },

    getConvenienceFee: (quantity) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/parcel-convenience-fee/${quantity}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getFiveStarConvenienceFee: (quantity) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/five-star/convenience-fee?quantity=${quantity}`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getConnectingBusPartners: () => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/list/connecting-partners`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getTransactions: (busCompanyId) => {
        // TODO: Add filter parameters as query
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getConnectingRoutes:(companyId)=>{

        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${companyId}/connecting-routes`,
            headers : {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    getTransactionSummary: (busCompanyId) => {
        // TODO: Add filter parameters as query
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/summary`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            }
        })
    },

    exportTransactions: (busCompanyId) => {
        // TODO: Add filter parameters as query
        return axios({
            method: 'post',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/export`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            responseType: 'arraybuffer',
        }).then(response => {
            // Source: https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Transactions.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
         });
    },

    getAllParcel: (params,busCompanyId)=>{
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            params:{
                "dateFrom": params.dateFrom,
                "dateTo": params.dateTo,
                "startStation": params.startStation,
                "endStation": params.endStation,
                //     "isP2p": String,
                //     "billOfLading": String,
                //     "senderName": String,
                //     "receiverName": String
             }
        })
    },
    exportCargoParcel: (params,busCompanyId,fileName)=>{
        const dateFormat = "MMM DD, YYYY";

        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/${busCompanyId}/list/export`,
            headers: {
                'x-auth-deviceid' : '1',
                'x-auth-devicetype' : config.header.deviceType,
                'x-auth-token' : userProfileObject.getToken()
            },
            responseType: 'arraybuffer',
            params:{
                "title":params.title,
                "dateFrom": params.dateFrom,
                "dateTo": params.dateTo,
                "startStation": params.startStation,
                "endStation": params.endStation,
                destination: params.destination,
                totalAmount: params.totalAmount,
                "fullName": params.fullName,
                date: moment(params.dateFrom).format(dateFormat) + " - " + moment(params.dateTo).format(dateFormat),
                isP2P: params.isP2P ? 1 : 0
             }
        }).then(response=>{
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
    },
    parcelPagination: (page, limit, search) => {
        return axios({
            method: 'get',
            url: `${BASE_URL}/api/v1/account/delivery-person/parcel/list/search-all`,
            headers: {
                'x-auth-deviceid': '1',
                'x-auth-devicetype': config.header.deviceType,
                'x-auth-token': userProfileObject.getToken()
            },
            params: {page, limit, search}
        })
    }

}

export default ParcelService;
