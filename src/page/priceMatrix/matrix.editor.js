import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, AutoComplete, Modal, notification, Tag} from "antd";
import {MatrixModal} from '../../component/modal'
import AddFixMatrixModalContent from  './container/modal.fixmatrix.container'
import DefaultFixMatrixModalContent from  './container/modal.default.fixmatrix.container'
import MatrixModalContent from  './container/modal.matrix.default.container'

import FiveStarMatrixModalContent from  './container/modal.matrix.fivestar.container'
import FiveStarMatrixModalLenghtRange from  './container/modal.matrix.fivestar.lenghtRange'
import FiveStarMatrixModalWeightRange from  './container/modal.matrix.fivestar.weightRange'

import {getBusPartner} from '../../utility/busCompanies'

import { UserProfile } from "../../utility";
import MatrixService from "../../service/Matrix";
import "./priceMatrix.css"
import { PlusOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const SHOW_LOG = true;


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

    const [busPartner, setBusPartner] = useState( getBusPartner() )

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

    const [fiveStarLenghtRangeModal, setFiveStarLenghtRangeModal] = useState({
        title:"Lenght Range Details",
        visible:false,
        data:undefined,
        type:undefined
    })

    const [fiveStarWeightRangeModal, setFiveStarWeightRangeModal] = useState({
        title:"Weight Range Details",
        visible:false,
        data:undefined,
        type:undefined
    })

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
        }else{
            props.data.handleErrorNotification(errorCode)
        }
    }

    const requestUpdate = ({originId, destinationId, stringValues}, callback)=>{
        MatrixService.create({
            busCompanyId: UserProfile.getBusCompanyId(),
            origin: originId,
            destination: destinationId,
            stringValues,
          }).then(async(e) => {
            const { success, errorCode } = e.data;
            if (!errorCode){
                notification["success"]({
                    message: "Updated Successfuly",
                    description: "All data are updated",
                });
            }else{
                props.data.handleErrorNotification(errorCode)
            }
            callback();
          });
    }

    const updateMatrix = async(val) =>{
        const matrix = busPartner.processMatrixObject(val)
        const index = matrixModal.data.index
        let dataSource = [...busPartner.getMatrixDataSource()];
        let item = dataSource[index];

        requestUpdate({
            originId: matrixModal.data.originId,
            destinationId: matrixModal.data.destinationId,
            stringValues: JSON.stringify({matrix, fixMatrix: item.fixMatrix || []})
        },()=>{
            dataSource[index] = {...dataSource[index], ...val}
            busPartner.setMatrixDataSource(dataSource)
            setMatrixModal(e=>({...e, visible:false, matrixInfo:undefined, data:undefined}))
        })
    }

    const updateFixPriceFiveStartMatrix = (values, data) =>{

        console.info(' values',values)
        console.info(' data', data)

        let _fixMatrix = undefined;

        switch (data.type) {
            case 'add':
                _fixMatrix = [...state.tempFixMatrixObject.fixMatrix]
                _fixMatrix.push(values)
                break

            case "edit":
                _fixMatrix = [...state.tempFixMatrixObject.fixMatrix]
                _fixMatrix[data.index] = values;
                break;

            case "delete":
                _fixMatrix = [...state.tempFixMatrixObject.fixMatrix]
                _fixMatrix = _fixMatrix.filter((e,i)=>i !== data.index)
                break;
        
            default:
                break;
        }

        const tempFixMatrixObject = {...state.tempFixMatrixObject, fixMatrix:_fixMatrix}
        const {fixMatrixDestinationId, fixMatrixOriginId}=state;

        requestUpdate({
            originId:fixMatrixOriginId,
            destinationId:fixMatrixDestinationId,
            stringValues: JSON.stringify(tempFixMatrixObject)
        },()=>{
            busPartner.setPriceMatrix(tempFixMatrixObject)
            setState(e=>({...e, tempFixMatrixObject}))
            setFixPriceModal(e=>({...e, visible:false, matrixInfo:undefined, data:undefined}))
        })
    }

    const onSelect = async(name, val) =>{
        let response = undefined;
        switch(name){
            case "startName" :   
                response = await props.data.getAllRoutesByOrigin(val);
                console.info('test0',response)
                busPartner.parseMatrixDataSource(response)
                setState(e=>{
                    return{
                        ...e,
                        startName: getListName(val, props.data.originList),
                        tempMatrixObject: response
                    }
                });
                break;

            case "fixMatrixOriginName" :   
                response = await props.data.getAllRoutesByOrigin(val);
                console.info('test1',response)
                setState(e=>({...e,
                    fixMatrixOriginId:val,
                    fixMatrixOriginName: getListName(val, props.data.originList),
                    fixMatrixDestinationName:"",
                    fixMatrixDestinationId:"",
                    destinationList: props.data.getEndStations(val, response)}));
                break;

            case "fixMatrixDestinationName" :   
                const result = await props.data.getMatrix(state.fixMatrixOriginId, val)
                const tempFixMatrixObject = parsePriceMatrix(result);
                console.info('test2',tempFixMatrixObject)
                busPartner.setPriceMatrix(tempFixMatrixObject)
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

    const broadcastListener = (e)=>{
        console.info('broadcastListener event',e)

        const{ data, action, index } = e
        switch (action) {
            
            case "five-star-view-lenght-click":
                setFiveStarLenghtRangeModal(e=>({...e, visible:true, data, index}))
                break;
            
            case "five-star-view-weight-click":
            setFiveStarWeightRangeModal(e=>({...e, visible:true, data, index}))
            break; 
        
            case "five-star-update-click":
            setMatrixModal(e=>({...e, 
                visible:true, 
                data:{
                    ...data,
                    index
                }, 
                matrixInfo:{
                    destination: data.destination,
                    destinationId: data.destinationId,
                    originId: data.originId,
                    fixMatrix: data.fixMatrix,
                    index
                } 
            }))
            break; 
        
            case "dltb-edit-fixmatrix-click":
            case "five-star-edit-fixmatrix-click":
                setFixPriceModal(e=>({...e, title:"Edit Fix Price", visible:true, type:"edit", data:{
                    ...data,
                    index,
                    names:state.tempFixMatrixObject.fixMatrix
                }}))
            break;
        
            case "dltb-del-fixmatrix-click":
            case "five-star-del-fixmatrix-click":
                setFixPriceModal(e=>({...e, title:"Edit Fix Price", visible:true, type:"delete", data:{
                    ...data,
                    index
                }}))
            break;
        
            case "dltb-add-fixmatrix-click":
            case "five-star-add-fixmatrix-click":
                setFixPriceModal(e=>({
                    ...e, 
                    title:"Add Fix Price", 
                    visible:true, 
                    type:"add", 
                    data:{
                        ...data
                    }
                }))
                break;
            
            case "dltb-update-click":
                setMatrixModal(e=>({...e, visible:true, data:{...data, index}}))
                break;
            
            default:
                break;
            
        }
    }

    const MatrixModalContainer = () =>{
        let view = undefined;
        switch (busPartner.getName()) {
            case "dltb":
                view = (<MatrixModalContent 
                    {...props}
                    okText="Update" 
                    cancelText="Cancel"
                    data={matrixModal.data}
                    onCancel={()=>setMatrixModal(e=>({...e, visible:false, data:undefined}))}
                    onSubmit={(val,data)=>updateMatrix(val,data)}/>)
                break;

            case "five-star":
                view = (<FiveStarMatrixModalContent 
                    {...props}
                    okText="Update" 
                    cancelText="Cancel"
                    data={matrixModal.data}
                    onCancel={()=>setMatrixModal(e=>({...e, visible:false, data:undefined}))}
                    onSubmit={(val)=>updateMatrix(val)}/>
)
                break;
        
            default:
                break;
        }
        return view;
    }

    const FixMatrixModalContainer = (props)=>{
        let View = undefined;
        switch (UserProfile.getBusCompanyTag()) {
            case "dltb":
                View = (<AddFixMatrixModalContent 
                {...props}
                type={fixPriceModal.type}
                okText={fixPriceModal.type === 'delete' ? fixPriceModal.type : "Save" } 
                cancelText="Cancel"
                data={fixPriceModal.data}
                onCancel={()=>setFixPriceModal(e=>({...e, visible:false, data:undefined}))}
                onSubmit={(val,data)=>updateFixPriceFiveStartMatrix(val,data)}/>)
            break;
        
            default:
                View = (<DefaultFixMatrixModalContent 
                    {...props}
                    type={fixPriceModal.type}
                    okText={fixPriceModal.type === 'delete' ? fixPriceModal.type : "Save" } 
                    cancelText="Cancel"
                    data={fixPriceModal.data}
                    onCancel={()=>setFixPriceModal(e=>({...e, visible:false, data:undefined}))}
                    onSubmit={(val,data)=>updateFixPriceFiveStartMatrix(val,data)}/>)
                break;
        }
        return View;
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
                            <>{ busPartner.getMatrixTable((c)=>broadcastListener(c))} </>
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
                    {
                        <>{busPartner.getFixPriceTableComponent((c)=>broadcastListener(c))}</>
                    }
                </Panel>
            </Collapse>
            </div>

            <MatrixModal 
                visible={fixPriceModal.visible} 
                title={fixPriceModal.title}>
                <FixMatrixModalContainer {...props}/>
            </MatrixModal>

            <MatrixModal 
                visible={matrixModal.visible} 
                title={matrixModal.title}>

                    <MatrixModalContainer {...props} />

            </MatrixModal>

            <MatrixModal 
                width={500}
                visible={fiveStarLenghtRangeModal.visible} 
                title={fiveStarLenghtRangeModal.title}>
                    <FiveStarMatrixModalLenghtRange 
                        {...props}
                        cancelText="Ok"
                        data={fiveStarLenghtRangeModal.data}
                        onCancel={()=>setFiveStarLenghtRangeModal(e=>({...e, visible:false, data:undefined}))}
                        onSubmit={(val,data)=>{console.info('update matrix')}}/>

            </MatrixModal>

            <MatrixModal 
                width={500}
                visible={fiveStarWeightRangeModal.visible} 
                title={fiveStarWeightRangeModal.title}>
                    <FiveStarMatrixModalWeightRange 
                        {...props}
                        cancelText="Ok"
                        data={fiveStarWeightRangeModal.data}
                        onCancel={()=>setFiveStarWeightRangeModal(e=>({...e, visible:false, data:undefined}))}
                        onSubmit={(val,data)=>{console.info('update matrix')}}/>
            </MatrixModal>

        </div> 
    )
}

export default DltbMatrix;