import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, Input} from "antd";
import FooterModal from './modal.footer'

function DeleteFixMatrixModalContent(props){
    return (<>
        <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
            <span style={{margin:'1rem', fontSize:'16px'}}>Are you sure you want to delete <span style={{fontWeight:'bold'}}>{`"${props.data.description}"`}</span>?</span>
        </div>
        <FooterModal onOk={props.onOk} onCancel={props.onCancel} />
    </>)
}

export default DeleteFixMatrixModalContent;