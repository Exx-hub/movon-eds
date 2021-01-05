import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, AutoComplete, Modal} from "antd";
import {MatrixModal, PromptModal} from '../../component/modal'
import "./priceMatrix.css";

import DeleteFixMatrixModalContent from './container/modal.delete.container'
import AddFixMatrixModalContent from  './container/modal.add.container'
import EditDefaultModalContent from './container/modal.edit.fixprice.container'
import { UserProfile } from "../../utility";

const { Panel } = Collapse;
const { Option } = Select;

const mData = {
    destination:"Naga",
    dvRate:5,
    addRate:70,
    basePrice:100,
    handlingFee:2,
    weightRate:10,
    allowableRate:7
}

function DltbMatrix(props){

    const [state, setState] = useState({
        startName:"",
        frOriginId:"",
        frDestinationId:"",
        frStartName:"",
        frEndName:"",
        destinationList:[],
        fixMatrix:[],
        matrix:[],
        matrixList:[],
        tempMatrixObject:{},
        tempFixMatrixObject:{matrix:[],fixMatrix:[]}
    })

    const [fixPriceModal, setFixPriceModal] = useState({
        visible:false,
        data:undefined,
        type:undefined
    })

    useEffect(()=>{
        console.info("props",props)
    });

    const getMatrixTableColumn = () =>{
        return [
        {
            title: 'Destination',
            dataIndex: 'destination',
            key: 'destination'
        },
        {
            title: 'Declared Value Rate',
            dataIndex: 'dvRate',
            key: 'dvRate'
        },
        {
            title: 'Allowable Weight',
            dataIndex: 'allowableRate',
            key: 'allowableRate'
        },
        {
            title: 'Handling Fee (per Kg.)',
            dataIndex: 'handlingFee',
            key: 'handlingFee'
        },
        {
            title: 'Additional Rate',
            dataIndex: 'addRate',
            key: 'addRate'
        },
        {
            title: 'Base Price',
            dataIndex: 'basePrice',
            key: 'basePrice'
        },
        {
            title: 'Action',
            dataIndex: 'dvRate',
            key: 'dvRate',
            render: ()=>(<Space>
                <Button size="small" style={{background:'gray'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Edit</span></Button>
            </Space>)
        },
        ]
    }

    const getMatrixTableSource = () =>{
        return state.matrixData;
    }

    const getFixMatrixTableColumn = () =>{
        
        return [
        {
            title: 'Description',
            dataIndex: 'name',
            key: 'description',
            width:150
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: "price"
        },
        {
            title: 'Declared Value Rate',
            dataIndex: 'declaredValue',
            key: 'declaredValue',
            width:150
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width:150,
            render: (t,r)=>{
                let fixMatrix = state.tempFixMatrixObject.fixMatrix
                return(<Space>
                    {
                        (fixMatrix.findIndex(e=> e.name === r.name) === fixMatrix.length-1) && <Button 
                        onClick={()=>{
                            if(Number(r.declaredValue) > 0 && Number(r.price) > 0){
                                setFixPriceModal(e=>({
                                    ...e, 
                                    visible:true, 
                                    type:"add",
                                    title:"Add Fix Price", 
                                    data:undefined}))
                            }else{
                                Modal.error({
                                    title: 'Validation Error',
                                    content: 'Declared Value or Price must greater than zero.',
                                });
                            }
                           
                        }}
                        size="small" 
                        style={{background:'green'}}>
                            <span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Add</span>
                        </Button>
                    }
                    
                    <Button 
                        onClick={()=>{
                            setFixPriceModal(e=>({
                                ...e,
                                visible:true,
                                title:"Edit Fix Price",
                                type:"edit",
                                data:{
                                    description:r.name,
                                    dvRate: r.declaredValue,
                                    price: r.price,
                                    index: fixMatrix.findIndex(e=> e.name === r.name),
                                    names: fixMatrix.filter(e=>e.name !== r.name).map(e=>(e.name))
                                }
                            }))
                        }}
                        size="small" 
                        style={{background:'gray'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Edit</span></Button>
                    {
                        !(fixMatrix.findIndex(e=> e.name === r.name) === 0) && 
                        <Button 
                            onClick={()=>{
                                setFixPriceModal(e=>({
                                    ...e,
                                    visible:true,
                                    title:"Delete Fix Price",
                                    type:"delete",
                                    data:{
                                        description:r.name,
                                        dvRate: r.declaredValue,
                                        price: r.price,
                                        index: fixMatrix.findIndex(e=> e.name === r.name),
                                        names: fixMatrix.filter(e=>e.name !== r.name).map(e=>(e.name))
                                    }
                                }))
                            }}
                            size="small" 
                            style={{background:'red'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}
                        >Delete</span></Button>}
                </Space>) 
            }
        },
        ]
    }

    const getFixMatrixTableSource = () =>{
        return state.tempFixMatrixObject.fixMatrix;
    }

    const getListName = (id, data) =>{
        const result = data.find(e=> e.stationId === id);
        return result.stationName || "";
    }  

    const parsePriceMatrix = (result) =>{
        const{success, data, errorCode}=result.data;
        if(Boolean(success)){
            let fixMatrix = [];
            let matrix = []
            if(!data){
                fixMatrix = [{...props.data.FIX_PRICE_FORMAT}]
                matrix = []
            }else{
                fixMatrix = data.fixMatrix
                matrix = data.matrix
            }
            return {matrix,fixMatrix}
        }
    }

    const updateFixMatrix = (val,index) =>{
        const tempFixMatrixObject = {...state.tempFixMatrixObject}
        let fixMatrix = [...tempFixMatrixObject.fixMatrix];
        if(index > -1){
            fixMatrix[index] = { name: val.name, price: val.price, declaredValue: val.declaredValue }
        }else{
            fixMatrix.push(val)
        }
        tempFixMatrixObject.fixMatrix = fixMatrix;
        console.log('data',JSON.stringify(tempFixMatrixObject))
        setState(e=>({...e,tempFixMatrixObject}))
        setFixPriceModal(e=>({...e, visible:false, data:undefined}))
    }

    const onSelect = async(name, val) =>{
        switch(name){
            case "startName" :   
                setState(e=>{
                    return{
                        ...e,
                        startName: getListName(val, props.data.originList),
                    }
                });
                break;
            case "frStartName" :   
                setState(e=>{
                    return{
                        ...e,
                        frOriginId:val,
                        frStartName: getListName(val, props.data.originList),
                        frEndName:"",
                        frDestinationId:"",
                        destinationList: props.data.getEndStations(val, props.data.routes)
                    }
                });
                break;
            case "frEndName" :   
                const result = await props.data.getMatrix(state.frOriginId, val)
                setState(e=>({
                    ...e,
                    tempFixMatrixObject: parsePriceMatrix(result),
                    frDestinationId:val,
                    frEndName: getListName(val, state.destinationList)
                }));
               
            break;
            default: break;
        }
    }

    return(
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Price Matrix" key="1">
                    <div style={{width:610, display:'flex', flexDirection:'row'}}>
                        <AutoComplete value={state.startName} placeholder="Origin" style={{ width: 300, marginBottom:'1rem' }} onSelect={(e)=>onSelect("startName",e)}>
                            {
                                props.data.originList.map(e=>(<Option value={e.stationId}>{e.stationName}</Option>))
                            }
                        </AutoComplete>
                    </div>
                    <Table bordered={true} pagination={false} columns={getMatrixTableColumn()} dataSource={getMatrixTableSource()}/>
                </Panel>
            </Collapse>
            <br />
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Fix Price Matrix" key="1">
                    <div style={{width:610, display:'flex', flexDirection:'row',justifyContent:"space-around"}}>
                        <Select 
                            value={state.frStartName} 
                            placeholder="Origin" 
                            style={{ width: 300, marginBottom:'1rem' }} 
                            onSelect={(e)=>onSelect("frStartName",e)}>
                        {
                            props.data.originList.map(e=>(<Option value={e.stationId}>{e.stationName}</Option>))
                        }
                        </Select>
                        <Select 
                            value={state.frEndName} 
                            placeholder="Destination" 
                            style={{ width: 300, marginBottom:'1rem'}}
                            onSelect={(e)=>onSelect("frEndName",e)}>
                        {
                            state.destinationList.map(e=>(<Option value={e.stationId}>{e.stationName}</Option>))
                        }
                        </Select>
                    </div>
                    <Table 
                        style={{width:610}} 
                        bordered={true} 
                        pagination={false} 
                        columns={getFixMatrixTableColumn()} 
                        dataSource={getFixMatrixTableSource()}/>
                </Panel>
            </Collapse>

            <MatrixModal 
                visible={fixPriceModal.visible} 
                title={fixPriceModal.title}>
                
                    <AddFixMatrixModalContent 
                        {...props}
                        type={fixPriceModal.type}
                        okText={fixPriceModal.type === 'delete' ? fixPriceModal.type : "Save" } 
                        cancelText="Cancel"
                        data={fixPriceModal.data}
                        onCancel={()=>setFixPriceModal(e=>({...e, visible:false, data:undefined}))}
                        onSubmit={(val,index)=>updateFixMatrix(val,index)}/>

            </MatrixModal>

        </div> 
    )
}

export default DltbMatrix;