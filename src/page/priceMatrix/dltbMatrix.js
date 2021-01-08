import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, AutoComplete, Modal, notification, Tag} from "antd";
import {MatrixModal} from '../../component/modal'
import AddFixMatrixModalContent from  './container/modal.fixmatrix.container'
import MatrixModalContent from  './container/modal.matrix.default.container'
import { UserProfile } from "../../utility";
import MatrixService from "../../service/Matrix";
import "./priceMatrix.css"

const { Panel } = Collapse;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

function DltbMatrix(props){

    const [state, setState] = useState({
        startName:"",
        fixMatrixOriginId:"",
        fixMatrixDestinationId:"",
        fixMatrixOriginName:"",
        fixMatrixDestinationName:"",
        destinationList:[],
        matrixList:[],
        tempMatrixObject:[],
        tempFixMatrixObject:{matrix:[],fixMatrix:[]},
    })

    const [fixPriceModal, setFixPriceModal] = useState({
        visible:false,
        data:undefined,
        type:undefined
    })

    const [matrixModal, setMatrixModal] = useState({
        title:"Update Matrix",
        visible:false,
        data:undefined,
        type:undefined
    })

    const getMatrixTableColumn = () =>{

        const dltb=[
            {
                title: 'Destination',
                dataIndex: 'destination',
                key: 'destination'
            },
            {
                title: 'Insurance Fee (%)',
                dataIndex: 'insuranceFee',
                key: 'insuranceFee'
            },
            {
                title: 'Min Declared Value',
                dataIndex: 'minDeclaredValue',
                key: 'minDeclaredValue'
            },
            {
                title: 'Max Declared Value',
                dataIndex: 'maxDeclaredValue',
                key: 'maxDeclaredValue'
            },
            {
                title: 'Declared Value Rate (%)',
                dataIndex: 'dvRate',
                key: 'dvRate'
            },
            {
                title: 'Allowable Weight',
                dataIndex: 'allowableWeight',
                key: 'allowableWeight'
            },
            {
                title: 'Excess Weight Rate',
                dataIndex: 'weightRate',
                key: 'weightRate'
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
                title: 'Short Haul',
                dataIndex: 'isShortHaul',
                key: 'isShortHaul',
                render: (val)=>{
                    console.info('val',val)
                    return (<Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${val ? (Boolean(val) ? "Yes" : "No") : "No" }`}</Tag>)
                }
            }, 
        ]
        const defaultSource =  [{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (t,r,index)=>{
                return (<Button 
                    onClick={()=>setMatrixModal(e=>({...e, visible:true, data:{...r, index}}))}
                    size="small" 
                    style={{background:'green'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Update</span></Button>)
            }
        }]
        return [...dltb,...defaultSource]
    }

    const getMatrixTableSource = () =>{
        return state.tempMatrixObject.map(e=>{
            console.info('temp',e)
            let _value = props.data.MatrixObjects[UserProfile.getBusCompanyTag()]
            if(e.stringValue){
                const temp = JSON.parse(e.stringValue)
                if(temp.matrix.length > 0){
                    _value = temp.matrix[0]
                }
            }
            return{
                ..._value,
                destination: e.endStationName,
                destinationId: e.end,
                originId: e.start
            }
        });
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
            title: 'Declared Value Rate',
            dataIndex: 'declaredValue',
            key: 'declaredValue',
            width:150
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: "price"
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width:150,
            render: (t,r,index)=>{
                let fixMatrix = state.tempFixMatrixObject.fixMatrix;
                return(<Space>
                    {
                        (index === fixMatrix.length-1) && <Button 
                        onClick={()=>{
                            if(Number(r.declaredValue) > 0 && Number(r.price) > 0){
                                setFixPriceModal(e=>({
                                    ...e, 
                                    visible:true, 
                                    type:"add",
                                    title:"Add Fix Price", 
                                    data:{
                                        names: fixMatrix.map(e=>(e.name.toLowerCase())),
                                    }}))
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
                        (Boolean(index === fixMatrix.length-1 && fixMatrix.length > 1) || fixMatrix.length > 1) && 
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
                                        index,
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
        if(!errorCode){
            let fixMatrix = [];
            let matrix = []
            if(!data){
                fixMatrix = [{...props.data.FIX_PRICE_FORMAT}]
                matrix = []
            }else{
                const stringValue = JSON.parse(data.stringValues)
                fixMatrix = stringValue.fixMatrix.length > 0 ? stringValue.fixMatrix : [{...props.data.FIX_PRICE_FORMAT}]
                matrix = stringValue.matrix || []
            }
            return {matrix,fixMatrix}
        }
    }

    const updateFixMatrix = (val,data) =>{
        const tempFixMatrixObject = {...state.tempFixMatrixObject}
        const fixMatrix = [...tempFixMatrixObject.fixMatrix];
        const{index, type}=data;

        switch (type) {
            case 'delete':
                fixMatrix = fixMatrix.filter((e,i)=> i !== index )
                break;
            case 'add':
                fixMatrix.push(val)
                break;
            case 'edit':
                fixMatrix[index] = { name: val.name, price: val.price, declaredValue: val.declaredValue }
                break;       
            default:
                break;
        }
        tempFixMatrixObject.fixMatrix = fixMatrix;
        MatrixService.create({
            busCompanyId: UserProfile.getBusCompanyId(),
            origin: state.fixMatrixOriginId,
            destination: state.fixMatrixDestinationId,
            stringValues: JSON.stringify(tempFixMatrixObject),
          }).then((e) => {
            const { success, errorCode } = e.data;
            if (!errorCode){
                setState(e=>({...e,tempFixMatrixObject}))
                setFixPriceModal(e=>({...e, visible:false, data:undefined}))
                notification["success"]({
                    message: "Updated Successfuly",
                    description: "All data are updated",
                });
            }
          });
    }

    const updateMatrix = async(val,data) =>{
        const{
            destinationId,
            index,
            originId,
        }=matrixModal.data;

        const{
            addRate,
            allowableWeight,
            basePrice,
            dvRate,
            handlingFee,
            minDeclaredValue,
            weightRate,
            isShortHaul,
            insuranceFee,
            maxDeclaredValue
        }=val;

        const matrix = [{
            addRate,
            allowableWeight,
            basePrice,
            dvRate,
            handlingFee,
            minDeclaredValue,
            weightRate,
            isShortHaul,
            insuranceFee,
            maxDeclaredValue
        }]

        const temp = JSON.parse(state.tempMatrixObject[index].stringValue);
        const fixMatrix = temp.fixMatrix || []
        const stringValues = JSON.stringify({matrix,fixMatrix})

        const _tempMatrixObject = [...state.tempMatrixObject]
        _tempMatrixObject[index].stringValue = stringValues

        MatrixService.create({
            busCompanyId: UserProfile.getBusCompanyId(),
            origin: originId,
            destination: destinationId,
            stringValues,
          }).then(async(e) => {
            const { success, errorCode } = e.data;
            if (!errorCode){
                setMatrixModal(e=>({...e, visible:false, data:undefined}))
                notification["success"]({
                    message: "Updated Successfuly",
                    description: "All data are updated",
                });
                setState(e=>{
                    return{
                        ...e,
                        tempMatrixObject: _tempMatrixObject
                    }
                });
            }
          });
    }

    const onSelect = async(name, val) =>{
        switch(name){
            case "startName" :   
                const response = await props.data.getAllRoutesByOrigin(val);
                setState(e=>{
                    return{
                        ...e,
                        startName: getListName(val, props.data.originList),
                        tempMatrixObject: response
                    }
                });
                break;
            case "fixMatrixOriginName" :   
                setState(e=>{
                    return{
                        ...e,
                        fixMatrixOriginId:val,
                        fixMatrixOriginName: getListName(val, props.data.originList),
                        fixMatrixDestinationName:"",
                        fixMatrixDestinationId:"",
                        destinationList: props.data.getEndStations(val, props.data.routes)
                    }
                });
                break;
            case "fixMatrixDestinationName" :   
                const result = await props.data.getMatrix(state.fixMatrixOriginId, val)
                const tempFixMatrixObject = parsePriceMatrix(result);
                setState(e=>({
                    ...e,
                    tempFixMatrixObject,
                    fixMatrixDestinationId:val,
                    fixMatrixDestinationName: getListName(val, state.destinationList)
                }));
               
            break;
            default: break;
        }
    }

    return(
        <div>

            <div style={{
                    padding:'1rem',
                    display:'flex', 
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'column', 
                    width:'100%'}}>

                
                <span style={{fontSize:'1.5rem', fontWeight:100}}>Price Matrix</span>
                <span style={{fontSize:'1.2rem', fontWeight:100 }}>{UserProfile.getBusCompanyName()}</span>

            </div>

            <div style={{padding:'1rem'}}>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="Price Matrix" key="1">
                        <div style={{width:610, display:'flex', flexDirection:'row'}}>
                            <AutoComplete value={state.startName} placeholder="Origin" style={{ width: 300, marginBottom:'1rem' }} onSelect={(e)=>onSelect("startName",e)}>
                                {
                                    props.data.originList.map(e=>(<Option value={e.stationId}>{e.stationName}</Option>))
                                }
                            </AutoComplete>
                        </div>
                        {
                            UserProfile.getBusCompanyTag() === "dltb" && 
                            <Table 
                                bordered={true} 
                                pagination={false} 
                                columns={getMatrixTableColumn()} 
                                dataSource={getMatrixTableSource()}/>
                        }
                        {
                             UserProfile.getBusCompanyTag() === "isarog-liner" && 
                             <Table 
                                bordered={true} 
                                pagination={false} 
                                dataSource={getMatrixTableSource()}>
                                    <Column title="Destination" dataIndex="address" key="address" />
                                    <Column title="Declared Value Rate" dataIndex="address" key="address" />
                                    <Column title="Allowable Weight" dataIndex="address" key="address" />
                                    <Column title="Excess Weight Rate" dataIndex="address" key="address" />
                                    <ColumnGroup title="Max Length">
                                        <Column title="Lenght 1" dataIndex="firstName" key="firstName" />
                                        <Column title="Lenght 2" dataIndex="lastName" key="lastName" />
                                    </ColumnGroup>
                                    <ColumnGroup title="Excess Lenght Rate">
                                        <Column title="Length Rate 1" dataIndex="firstName" key="firstName" />
                                        <Column title="Length Rate 1" dataIndex="lastName" key="lastName" />
                                    </ColumnGroup>
                                    <Column title="Tariff Rate" dataIndex="address" key="address" />
                                    <Column title="Price" dataIndex="address" key="address" />
                            </Table>
                        }
                    </Panel>
                </Collapse>
                <Collapse>
                <Panel header="Fix Price Matrix" key="1">
                    <div style={{width:610, display:'flex', flexDirection:'row',justifyContent:"space-around"}}>
                        <Select 
                            value={state.fixMatrixOriginName} 
                            placeholder="Origin" 
                            style={{ width: 300, marginBottom:'1rem' }} 
                            onSelect={(e)=>onSelect("fixMatrixOriginName",e)}>
                        {
                            props.data.originList.map(e=>(<Option value={e.stationId}>{e.stationName}</Option>))
                        }
                        </Select>
                        <Select 
                            value={state.fixMatrixDestinationName} 
                            placeholder="Destination" 
                            style={{width: 300, marginBottom:'1rem'}}
                            onSelect={(e)=>onSelect("fixMatrixDestinationName",e)}>
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
            </div>

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
                        onSubmit={(val,data)=>updateFixMatrix(val,data)}/>

            </MatrixModal>

            <MatrixModal 
                visible={matrixModal.visible} 
                title={matrixModal.title}>
                
                    <MatrixModalContent 
                        {...props}
                        okText="Update" 
                        cancelText="Cancel"
                        data={matrixModal.data}
                        onCancel={()=>setMatrixModal(e=>({...e, visible:false, data:undefined}))}
                        onSubmit={(val,data)=>updateMatrix(val,data)}/>

            </MatrixModal>

        </div> 
    )
}

export default DltbMatrix;