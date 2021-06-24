import React from "react";
import {Table, Button, Space, Tag} from "antd";
import { PlusOutlined } from '@ant-design/icons';

class Dltb{

    constructor(){
        this.name = "dltb";
        this.dataSource = [];
        this.priceMatrix = {matrix:[], fixMatrix:[]}
        this.message={
            BUTTON_UPDATE_CLICK:`update-click`,
            BUTTON_DEL_CLICK:`del-click`,
            BUTTON_VIEW_LENGHT_DETAILS:`view-lenght-click`,
            BUTTON_VIEW_WEIGHT_DETAILS:`view-weight-click`,
            BUTTON_EDIT_FIXMATRIX:`edit-fixmatrix-click`,
            BUTTON_DEL_FIXMATRIX:`del-fixmatrix-click`,
            BUTTON_ADD_FIXMATRIX:`add-fixmatrix-click`
        };    
    }

    setPriceMatrix(priceMatrix){
        if(priceMatrix.hasOwnProperty('matrix') && priceMatrix.hasOwnProperty('fixMatrix')){
            this.priceMatrix = priceMatrix
            this.setFixMatrix(priceMatrix.fixMatrix)
            this.setMatrix(priceMatrix.matrix)
        }
    }   

    setMatrix(matrix){
        this.matrix = matrix;
    }

    setFixMatrix(fixMatrix){
        this.fixMatrix = fixMatrix;
    }

    setMatrixDataSource(dataSource){
        this.dataSource = dataSource
    }

    parseMatrixDataSource(dataSource){
        const result = dataSource.map(e=>{
            let _value = []
            let fixMatrix = [{}]
            if(e.stringValue){
                const temp = JSON.parse(e.stringValue)
                
                if(temp.matrix && temp.matrix.length > 0){
                    _value = temp.matrix[0]

                    if (!_value.accompaniedBaggage) {
                        _value.accompaniedBaggage = 0;
                    }
                    if (!_value.accompaniedBaggageFee) {
                        _value.accompaniedBaggageFee = 0
                    }
                }

                if(temp.fixMatrix && temp.fixMatrix.length > 0){
                    fixMatrix = temp.fixMatrix
                }
            }
            return{
                ..._value,
                fixMatrix,
                destination: e.endStationName,
                destinationId: e.end,
                originId: e.start
            }
        });
        this.dataSource = result
    }

    getName(){
        return this.name;
    }

    getMessage(msg){
        return this.message
    }
    
    getMessageName = (msg)=>{
        let name = undefined
        for (const [key, value] of Object.entries(this.message)) {
            if(msg === value){
                name = key
            }
        }    
        return name       
    }

    getMatrix(){
        return this.matrix
    }

    getFixMatrix(){
        return this.fixMatrix
    }

    getFixMatrixFormat(){
        return{
            name:"No Data",
            price:0,
            declaredValue:0,
        }
    }

    getMatrixDataSource(){
        return this.dataSource
    }

    getTableColumn(callback){
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
                title: 'Max Declared Value Add Rate Threshold',
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
                title: 'Min Accompanied Baggage',
                dataIndex: 'accompaniedBaggage',
                key: 'accompaniedBaggage',
                align: 'center',
                render: (text) => (<span>{Number(text || 0)} kg.</span>)
            },
            {
                title: 'Accompanied Baggage Fee',
                dataIndex: 'accompaniedBaggageFee',
                key: 'accompaniedBaggageFee',
                align: 'right',
                render: (text) => (<span>₱ {Number(text).toFixed(2)}</span>)
            },
            {
                title: 'Short Haul',
                dataIndex: 'isShortHaul',
                key: 'isShortHaul',
                render: (val)=>{
                    return (<Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${val ? (Boolean(val) ? "Yes" : "No") : "No" }`}</Tag>)
                }
            }, 
        ]

        const defaultSource =  [{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (t,row,index)=>{
                return (<Button 
                    onClick={()=>callback({
                        name: this.name,
                        action:this.message.BUTTON_UPDATE_CLICK,
                        data:{
                            ...row,
                        },
                        index
                    })}
                    size="small" 
                    style={{background:'green'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Update</span></Button>)
            }
        }]
        return [...dltb,...defaultSource]
    }

    getMatrixTable(callback){
        return( 
        <Table 
            scroll={{x:true}}
            bordered={true} 
            pagination={false} 
            columns={this.getTableColumn(callback)} 
            dataSource={this.getMatrixDataSource()}/>)
    }

    getFixMatrixTableColumn(callback){
        
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
                title: 'Enable Additional Fee',
                dataIndex: 'additionalFee',
                key: "additionalFee",
                render: (val)=>{
                    return (<Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${val ? (Boolean(val) ? "Yes" : "No") : "No" }`}</Tag>)
                }
            }, 
            {
                title: 'Enabled Accompanied Baggage',
                dataIndex: 'enabledAccompaniedBaggage',
                key: "enabledAccompaniedBaggage",
                render: (val) => {
                    return (<Tag size="small" color={`${Boolean(val) ? "blue" : "red"}`}>{`${val ? (Boolean(val) ? "Enabled" : "Disabled") : "Disabled"}`}</Tag>)
                }
            },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width:150,
            render: (t,row,index)=>{
                return(<Space>
                    <Button 
                        onClick={()=>{
                            callback({
                                name: this.name,
                                action:this.message.BUTTON_EDIT_FIXMATRIX,
                                data:row,
                                index
                            })
                        }}
                        size="small" 
                        style={{background:'gray'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Edit</span>
                    </Button>
                    <Button 
                        onClick={()=>{
                            callback({
                                name: this.name,
                                action:this.message.BUTTON_DEL_FIXMATRIX,
                                data:row,
                                index
                            })
                        }}
                        size="small" 
                        style={{background:'red'}}><span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Remove</span>
                    </Button>
                </Space>) 
            }
        },
        ]
    }

    getFixPriceTableComponent(callback){
        return(<>
            <Table 
                scroll={{x:true}}
                style={{width:700}} 
                bordered={true} 
                pagination={false} 
                columns={this.getFixMatrixTableColumn((c)=>callback(c))} 
                dataSource={this.getFixMatrix()}
                />
            { this.getFixMatrix() && <Button  
                style={{width:700, marginTop:'1rem'}} 
                block={true} 
                type="dashed" 
                onClick={() => callback({
                    action: this.message.BUTTON_ADD_FIXMATRIX,
                    data:{ names: this.getFixMatrix().map(e=>({name:e.name})) }
                })} 
                icon={<PlusOutlined />}>
                Add Fix Price
            </Button>}
        </>)
    }

    processMatrixObject(val){
        const matrix = [{
            addRate: val.addRate,
            allowableWeight : val.allowableWeight,
            basePrice : val.basePrice,
            dvRate : val.dvRate,
            handlingFee : val.handlingFee,
            minDeclaredValue : val.minDeclaredValue,
            weightRate: val.weightRate,
            isShortHaul: val.isShortHaul,
            insuranceFee: val.insuranceFee,
            maxDeclaredValue: val.maxDeclaredValue,
            accompaniedBaggage: val.accompaniedBaggage,
            accompaniedBaggageFee: val.accompaniedBaggageFee,
        }]
        return matrix;
    }
}

export default Dltb;