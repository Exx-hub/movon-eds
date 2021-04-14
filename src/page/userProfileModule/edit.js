import React, { useEffect } from "react";
import {Input,Button} from "antd";
import User from "../../service/User";
import "./changePassword.scss";

function EditPassword(props) {
  const [state, setState] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    fetching:false
  })

  const [errorState, setErrorState] = React.useState({
    oldPassword:{message:"", enabled:false},
    newPassword:{message:"", enabled:false},
    confirmPassword:{message:"", enabled:false}
  })

  const onChange = (name, value)=>{
    let _state = {...state}
    _state[name] = value
    setState((oldState)=>({...oldState, ..._state}))
  }

  const onBlur=(name)=>{
    let hasError = false
    let _errorState = {...errorState}

    if(!_errorState[name]){
      return hasError;
    }

    _errorState[name].enabled = true;
    
    //check if empty
    if(name === 'oldPassword' || name === 'newPassword' || name === 'confirmPassword'){
      if(state[name] === ''){
        _errorState[name].message=`required field`;
        hasError = true;
      }
    }

    if(!state[name]){
      _errorState[name].message=`required field`;
      hasError = true;
    }

    //check if has change
    if( name === 'oldPassword' || name === 'newPassword' || name === 'confirmPassword'){
      //check lenght
      if(state[name].length < 6){
        _errorState[name].message=`invalid length`;
        hasError = true
      }
      if((name === 'newPassword' && state.confirmPassword && state[name] !== state.confirmPassword)){
        _errorState[name].message=`password mis-match`;
        hasError = true
      }
      if((name === 'confirmPassword' && state.newPassword && state[name] !== state.newPassword)){
        _errorState[name].message=`password mis-match`;
        hasError = true
      }
      if(!hasError && name !== 'oldPassword' && state[name] === state.password){
        _errorState[name].message=`current password was replicated, please try to use another`;
        hasError = true
      }
    }

    setErrorState((oldState)=>({...oldState, ..._errorState}))

    if(hasError){
      return hasError;
    }

    _errorState[name].enabled = false;
    _errorState[name].message=``;
    setErrorState((oldState)=>({...oldState, ..._errorState}))

    return hasError
  }

  useEffect(()=>{

  },[state])

  const updateProfile = () =>{
    let hasError = false;
    const option = {...state}

    for(var item in option){
      let result = onBlur(item);
      if(result.hasError){ 
        hasError = true;
        break; 
      }
    }

    if(!hasError){
      console.info('update password-------->>>')
      console.info('update password-------->>>')
      console.info('update password-------->>>')
      User.updatePassword({newPassword:state.newPassword, oldPassword:state.oldPassword}).
      then(e=>{
        console.info('updatePassword',e)
        const{errorCode, data}=e.data;
        let hasError = false
        if(errorCode){
          props.action.handleErrorNotification(errorCode, props)
          hasError = true;
          return
        }
        if(data.updated === true)
          props.onOk(data.updated)
      })
    }
  }

  return (
    <div className="user-profile-module" style={{borderLeft:'none', padding:0}} >

    <div className="main-creds" style={{margin:0}}>
       <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Current Password</span>
        <Input  
          style={{width:'100%', borderColor:`${errorState.oldPassword.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          value={state.oldPassword} 
          onBlur={()=>onBlur('oldPassword')}
          type="text" placeholder="" 
          onChange={e => onChange('oldPassword', e.target.value)} />
          <span style={{color:'red', display:`${errorState.oldPassword.enabled ? "block" : 'none'}`}}> Error: {errorState.oldPassword.message}</span>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">New Password</span>
        <Input  
          style={{width:'100%', borderColor:`${errorState.newPassword.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          onBlur={()=>onBlur('newPassword')}
          value={state.newPassword} 
          type="text" placeholder="" 
          onChange={e => onChange('newPassword', e.target.value)} />
        <span style={{color:'red', display:`${errorState.newPassword.enabled ? "block" : 'none'}`}}> Error: {errorState.newPassword.message}</span>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Confirm Password</span>
        <Input  
          style={{width:'100%', borderColor:`${errorState.confirmPassword.enabled ? "red" : '#d9d9d9'}`}}
          size="large"
          onBlur={()=>onBlur('confirmPassword')}
          value={state.confirmPassword} 
          type="text" placeholder="" 
          onChange={e => onChange('confirmPassword', e.target.value)} />
        <span style={{color:'red', display:`${errorState.confirmPassword.enabled ? "block" : 'none'}`}}> Error: {errorState.confirmPassword.message}</span>
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

export default EditPassword;

