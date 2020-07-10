export const config = {
    BASE_URL:"http://192.168.0.104:8000",
    _BASE_URL:"https://movon-backend-dev.tk",
    api_domain: 'http://ec2-52-74-225-236.ap-southeast-1.compute.amazonaws.com:8000',
    api_domain_prod:'http://ec2-54-179-191-186.ap-southeast-1.compute.amazonaws.com',
    
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
    parcelStatus:{
        1:'created', // Created by delivery person on the source
        2:'intransit', // Boarded by Conductor
        3:'received', // received by the delivery person on the destination
        4:'claimed', // claimed by the recipient on the destination
        5:'delivered'
    }
}

export const errorDetails = {
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
}
