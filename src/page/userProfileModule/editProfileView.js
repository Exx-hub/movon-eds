import React, { useEffect } from "react";
import {Input,Button} from "antd";
import User from "../../service/User";
import {UserProfile} from "../../utility";
import "./changePassword.scss";

function UserEditProfileModule(props) {

  const { displayId } = UserProfile.getUser()
  const { firstName, lastName, phone} = UserProfile.getPersonalInfo();
  const [state, setState] = React.useState({
    displayId: displayId,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phone && (phone.number || "") ,
    fetching:false
  })
  const [errorState, setErrorState] = React.useState({
    displayId:{message:"", enabled:false},
    firstName:{message:"", enabled:false},
    lastName:{message:"", enabled:false},
    phoneNumber:{message:"", enabled:false}
  })

  const onChange = (name, value)=>{
    let _state = {...state}
    _state[name] = value
    setState((oldState)=>({...oldState, ..._state}))
  }

  const onBlur=(name)=>{
    let data = UserProfile.getPersonalInfo();
    let hasChange = false
    let hasError = false
    let _errorState = {...errorState}

    console.log('name',name)
    console.log('state[name]',state[name])

    if(!_errorState[name]){
      return {hasError,hasChange};
    }

    _errorState[name].enabled = true;
    
    //check if empty
    if(name === 'firstName' || name === 'lastName' || name === 'phoneNumber' || name === 'displayId'){
      if(state[name] === ''){
        _errorState[name].message=`required field`;
        hasError = true;
      }
    }

    //check if has change
    if(name === 'phoneNumber'){
      if(state[name] !== phone.number){
        if(state[name].length !== 10){
          _errorState[name].message=`invalid length`;
          hasError = true
        }
        var pattern = /^\d+$/;
        if(!pattern.test(state[name])){
          _errorState[name].message=`invalid number`;
          hasError = true
        }
        hasChange = true
      }
    }

    if(name === 'displayId'){
      if(state[name] !== displayId){
        if(state[name].length < 6){
          _errorState[name].message=`invalid length`;
          hasError = true
        }
        hasChange = true;
      }
    }

    setErrorState((oldState)=>({...oldState, ..._errorState}))

    if(hasError){
      return hasError;
    }

    _errorState[name].enabled = false;
    _errorState[name].message=``;
    setErrorState((oldState)=>({...oldState, ..._errorState}))
    return {hasError,hasChange};
  }

  useEffect(()=>{

  },[state])

  const updateProfile = () =>{
    let hasError = false;
    let changeValues = {}
    let size = 0;
    const option = {...state}

    for(var item in option){
      let result = onBlur(item);

      if(result.hasError){ 
        hasError = true;
        break; 
      }

      if(!result.hasError && result.hasChange){
        if(item === 'displayId'){
          changeValues = {...changeValues, ...{'staffId':state[item]}}
        }else{
          changeValues = {...changeValues, ...{[item]:state[item]}}
        }
        size ++;
      }
    }

    console.info('hasError',hasError)
    console.info('size',size)
    console.info('changeValues',changeValues)

    if(!hasError && size > 0){
      User.updatePersonalInfo(changeValues)
      .then(e=>{
        console.log('[updatePersonalInfo]',e)
        const{errorCode, data}=e.data;
        let hasError = false
        if(errorCode){
          props.action.handleErrorNotification(errorCode,props)
          hasError = true;
          return;
        }

        let json = {...UserProfile.getCredential()};
        console.log('json',json)
        if(data.userName && (json.displayId !== data.userName)){
          json.user.displayId = data.userName;
        }
        json.user.personalInfo = {...json.user.personalInfo, ...data.personalInfo};
        UserProfile.setCredential(json);

        props.onOk(hasError)
      })
    }
  }

  return (
    <div className="user-profile-module" style={{borderLeft:'none', padding:0}} >

    <div className="main-creds" style={{margin:0}}>
    
       <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">First Name</span>
        <Input 
          style={{width:'100%', borderColor:`${errorState.firstName.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          value={state.firstName} 
          onBlur={()=>onBlur('firstName')}
          type="text" placeholder="" 
          onChange={e => onChange('firstName', e.target.value)} />
          <span style={{color:'red', display:`${errorState.firstName.enabled ? "block" : 'none'}`}}> Error: {errorState.firstName.message}</span>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Last Name</span>
        <Input 
          style={{width:'100%', borderColor:`${errorState.lastName.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          onBlur={()=>onBlur('lastName')}
          value={state.lastName} 
          type="text" placeholder="" 
          onChange={e => onChange('lastName', e.target.value)} />
        <span style={{color:'red', display:`${errorState.lastName.enabled ? "block" : 'none'}`}}> Error: {errorState.lastName.message}</span>

      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Phone Number</span>
        <Input value={state.phoneNumber} 
          onBlur={()=>onBlur('phoneNumber')}
          style={{width:'100%', borderColor:`${errorState.phoneNumber.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          type="number" 
          pattern="[0-9]{10}" 
          placeholder="" 
          onChange={e => onChange('phoneNumber', e.target.value)} />
        <span style={{color:'red', display:`${errorState.phoneNumber.enabled ? "block" : 'none'}`}}> Error: {errorState.phoneNumber.message}</span>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Username</span>
        <Input 
          style={{width:'100%', borderColor:`${errorState.displayId.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          value={state.displayId} 
          type="text" 
          onBlur={()=>onBlur('displayId')}
          placeholder="" 
          onChange={e => onChange('displayId', e.target.value)} />
          <span style={{color:'red', display:`${errorState.displayId.enabled ? "block" : 'none'}`}}> Error: {errorState.displayId.message}</span>
      </div>
 
      <div className="button-wrapper-edit" 
        style={{ alignSelf:'center', display:'flex', width:'100%', alignItems:'center', marginLeft:0, marginTop:'2rem', marginBottom:'2rem', padding:0}}>

        <Button className="button-cancel"
          type="primary"
          shape="square"
          size="large"
          onClick={() => props.onCancel() }>
          Cancel
        </Button>

        <Button className="button-update"
          disabled={state.fetching}
          type="primary"
          shape="square"
          size="large"
          onClick={() => {
            updateProfile()
          }}>
          Update
        </Button>
      </div>

    </div>
  </div>)

}

export default UserEditProfileModule;
