import React from 'react';
import {  Input } from 'antd';
import './input.scss'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

function _suffix(props){
    let view = props.hasError ? <CloseOutlined style={{color:'red'}}/> : <CheckOutlined style={{color:'green'}} />
    return(view)
}

function InputView(props) {
    const isRequired = Boolean(props.isRequired, false)
    let accepted = Boolean(props.accepted, false)
    let hasError =  Boolean(isRequired && !accepted, false)

    return (
    <div className="component-input">
        <Input 
            onClick={props.onBlur}
            className={[ hasError ? "input-has-error" : ""]}
            suffix={ hasError && _suffix({ hasError }) }
            placeholder={props.placeholder || "is required"} 
            value={props.value} 
            onChange={props.onChange}/>
        {  hasError && <span className="input-error-message">{props.errorMessage || `${props.placeholder} is required` }</span> }
    </div>)
}

export default InputView;