import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, Input} from "antd";
import FooterModal from './modal.footer'

function EditDefaultModalContent(props){

    const setDltbObject = (description, declaredValue, AllowableWeight, HandlingFee, AddRate, BasePrice) =>{
        const content=[
            { title: "Description", value:description, key:"" },
            { title: "Declared Value", value: declaredValue, key:"" },
            { title: "Allowable Weight", value: AllowableWeight, key:"" },
            { title: "Additional Rate", value: AddRate, key:"" },
            { title: "Base Price", value: BasePrice, key:"" },
            { title: "Handling Fee", value: HandlingFee, key:"" }
        ];
        return content;
    }

    const setDefaultObject = (description, declaredValue, AllowableWeight, HandlingFee, AddRate, BasePrice) =>{
        const content=[
            { title: "Declared Value Rate(%)", value:description, key:"" },
            { title: "Allowable Weight(kgs.)", value: declaredValue , key:""},
            { title: "Excess Weight Rate(", value: AllowableWeight, key:"" },
            { title: "Additional Rate", value: AddRate, key:"" },
            { title: "Base Price", value: BasePrice, key:"" },
            { title: "Handling Fee", value: HandlingFee, key:"" }
        ];
        return content;
    }

    const AddItem = (addItemProps) =>{
        return(
            <div style={{marginBottom:'.2rem', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <span style={{width:150, textAlign:'right'}}>{addItemProps.title}</span>
                <Input style={{marginLeft:'.3rem', width:250}} value={addItemProps.value} onChange={addItemProps.onChange} /> 
            </div>)
    }

    let content = undefined;
    const data = props.data;
    switch(props.tag){
        case "dltb": content = setDltbObject(data.description, data.declaredValue, data.AllowableWeight, data.handlingFee, data.addRate, data.basePrice); break;
        case "five-star":
        case "isarog-liner": content = {}; break;
        default: break;
    }
    return (<>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
            <AddItem title="Description" value={props.data.description} onChange={(e)=> props.onChange("description",e.targe.value) }/>
            <AddItem title="Declared Value Rate" value={props.data.description} onChange={(e)=> props.onChange("dvRate",e.targe.value) }/>
            <AddItem title="Price" value={props.data.description} onChange={(e)=> props.onChange("price",e.targe.value) }/>
        </div> 
    </>)
}

export default EditDefaultModalContent;