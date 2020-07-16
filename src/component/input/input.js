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
    let hasError = Boolean(isRequired && !accepted)

    return (
    <div className="component-input">
        <Input
            size="default"
            style={{width:'100%'}}
            disabled={props.disabled}
            onBlur={props.onBlur}
            className={[ (props.showError || hasError) ? "input-has-error" : ""]}
            prefix={props.prefix}
            //suffix={ hasError ? _suffix({ hasError }) : null }
            placeholder={props.placeholder} 
            value={props.value} 
            name={props.name}
            type={props.type}
            onChange={props.onChange}/>
        {  (props.showError || hasError) && <span className="input-error-message">{ props.errorMessage || `${props.placeholder} is required` }</span> }
    </div>)
}

export default InputView;