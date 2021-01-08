import React from "react";
import {Button} from "antd";

function FooterModal(props){
    return(
        <div>
            <Button 
                shape="round" 
                onClick={props.onCancel}
                style={{fontWeight:'bold', width:150,  backgroundColor:"#6c757d", color:'#fff', marginRight:'.3rem'}}>{props.cancelText || "Cancel"}</Button>

            {
                props.enableDelete ? 
                <Button 
                    htmlType="submit"
                    shape="round" 
                    onClick={()=>props.onOk}
                    style={{fontWeight:'bold', width:150, backgroundColor:'red', color:'#fff'}}>Delete</Button> 
                : 
                <Button 
                    htmlType="submit"
                    shape="round" 
                    onClick={()=>props.onOk}
                    style={{fontWeight:'bold', width:150, backgroundColor:'#43b73e', color:'#fff'}}>{props.okText || "Ok"}</Button>
            }

            
        </div>
    )
}

export default FooterModal;