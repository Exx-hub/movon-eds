import React from 'react';
import {  Input, InputNumber } from 'antd';
import './input.scss'

function InputView(props) {
    const isRequired = Boolean(props.isRequired, false)
    let accepted = Boolean(props.accepted, false)
    let hasError = Boolean(isRequired && !accepted)

    if(props.name === 'length'){
        console.info('inputView', props)
    }

    return (
    <div className="component-input">
        <>
        {
           props.type === 'number' ? <InputNumber
           {...props}
           min={0}
           size={props.size || "default"}
           style={{width:'100%'}}
           disabled={props.disabled}
           onBlur={props.onBlur}
           className={[ (props.showError || hasError) ? "input-has-error" : ""]}
           prefix={props.prefix}
           placeholder={props.placeholder} 
           value={props.value} 
           name={props.name}
           type={props.type}
           onChange={props.onChange}/>
           :
           <Input
            {...props}
            size={props.size || "default"}
            style={{width:'100%'}}
            disabled={props.disabled}
            onBlur={props.onBlur}
            className={[ (props.showError || hasError) ? "input-has-error" : ""]}
            prefix={props.prefix}
            placeholder={props.placeholder} 
            value={props.value} 
            name={props.name}
            type={props.type}
            onChange={(e)=>props.onChange(e.target.value, props.name)}/>
        }
        </>
        {  (props.showError || hasError) && <span className="input-error-message">{ props.errorMessage || `${props.placeholder} is required` }</span> }
    </div>)
}

export default InputView;