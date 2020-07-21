export const config = {
    //BASE_URL:"http://192.168.0.103:8000",
    //BASE_URL:"https://movon-backend-dev.tk",
    BASE_URL:'https://movon.com.ph/server',
    parcelStatus:{
        1:'created', 
        2:'intransit', 
        3:'received', 
        4:'claimed', 
        5:'delivered'
    },
    ticket:{
        totalCopy:6
    }
}

//console.log('NODE_ENV',process)

export const ERROR_CODES = {
    7002:{
        module:'LOGIN',
        code: "DELIVERY_PERSON_NOT_FOUND",
        message: "Login Failed",
        description: "username or password is not correct"
    },
    1003:{
        module:'LOGIN',
        code: "PASSWORD_MISMATCH",
        message: "Login Failed",
        description: "username or password is not correct"
    },
    1000:{
        module:'MANIFEST',
        code: 'SESSION_NOT_FOUND',
        message: "Session Expired",
        description: "Please logout your account and login again."
    },
    403:{
        module:'PARCEL',
        code: 'PARCEL_PRICE_CONFIG_NOT_FOUND',
        message: "Bus Configuration Error",
        description: "No configuration found. Please contact Movon technical support!"
    },
    7003:{
        module:'PARCEL',
        code: 'PARCEL_PRICE_CONFIG_NOT_FOUND',
        message: "Bus Configuration Error",
        description: "No configuration found. Please contact Movon technical support!"
    },
}
