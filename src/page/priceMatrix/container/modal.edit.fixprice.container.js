import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, Input} from "antd";
import FooterModal from './modal.footer'

function EditDefaultModalContent(props){
    const AddItem = (addItemProps) =>{
        return(
            <div style={{marginBottom:'.2rem', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <span style={{width:150, textAlign:'right'}}>{addItemProps.title}</span>
                <Input style={{marginLeft:'.3rem', width:250}} value={addItemProps.value} onChange={addItemProps.onChange} /> 
            </div>)
    }
    return (<>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
            <AddItem title="Description" value={props.data.description} onChange={(e)=> props.onChange("description",e.targe.value) }/>
            <AddItem title="Declared Value Rate" value={props.data.dvRate} onChange={(e)=> props.onChange("dvRate",e.targe.value) }/>
            <AddItem title="Price" value={props.data.price} onChange={(e)=> props.onChange("price",e.targe.value) }/>
        </div> 
    </>)
}

export default EditDefaultModalContent;