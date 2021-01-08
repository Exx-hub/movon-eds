import React, { useEffect, useState } from "react";
import {Select} from "antd";

const {Option} = Select;

function SelectOrigin(props){

    const[originList, setOriginList] = useState([])

    useEffect(()=>{

    },[])

    return(
        <Select placeholder="Origin" style={{ width: 300, marginBottom:'1rem' }}>
        {
            originList.map(e=>(<Option value={e._id}>{e.name}</Option>))
        }
        </Select>
    )
}

export default SelectOrigin;