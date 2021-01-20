import React from "react";
import { Button, Form, Input, InputNumber, Space } from "antd";
import FooterModal from './modal.footer'
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function MatrixModalContent(props) {

    return (<div>

        <div style={{marginTop:'1rem',  display:'flex', justifyContent:'space-between', paddingLeft:'1rem', paddingRight:'1rem'}}>
            <div>Range</div>
            <div>Price</div>
        </div>

        <div style={{marginTop:'.8rem', border:"dashed gray 1.5px", display:'flex', justifyContent:'space-between', padding:'1rem'}}>
            <div><span style={{fontSize:16, fontWeight:'bold'}}>1 kg</span> - <span style={{fontSize:16, fontWeight:'bold'}}>5 kg</span></div>
            <div style={{color:'green', fontSize:16, fontWeight:'bold'}}>Php 140.00</div>
        </div>

        <div style={{marginTop:'.5rem', border:"dashed gray 1.5px", display:'flex', justifyContent:'space-between', padding:'1rem'}}>
            <div><span style={{fontSize:16, fontWeight:'bold'}}>1 kg</span> - <span style={{fontSize:16, fontWeight:'bold'}}>5 kg</span></div>
            <div style={{color:'green', fontSize:16, fontWeight:'bold'}}>Php 140.00</div>
        </div>

        <div style={{marginTop:'2rem', display: "flex", justifyContent: 'flex-end' }}>
            <FooterModal
                enableSingleButton={true}
                cancelText={props.cancelText || "Cancel"}
                okText={props.okText || "Save"}
                onOk={props.onOk}
                onCancel={props.onCancel} />
        </div>
            
        </div>)
}

export default MatrixModalContent;