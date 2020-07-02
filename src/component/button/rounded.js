import React from 'react';
import {Button, Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './button.scss';

const RoundedButton = (props) =>{
    return (<div className="component-rounded-button">
        <Button 
            shape="round"
            className={ `${props.disabled ? "rounded-button-disabled" : "rounded-button"}`} 
            block 
            htmlType={props.htmlType}
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}>
                <div style={{position:'relative', display:'flex', justifyContent:'center'}}>
                {
                    props.disabled && <div style={{position:'absolute', margin:'0 auto'}}>
                        <Spin indicator={<LoadingOutlined style={{fontSize: 24, color:'teal' }} spin />} />
                    </div>
                }
                {props.caption || "Button"}
                </div>
            </Button>
    </div>)
}

export default RoundedButton;