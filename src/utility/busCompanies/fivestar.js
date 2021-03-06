import React from "react";
import {Table, Button, Space} from "antd";
import { PlusOutlined } from '@ant-design/icons';

class FiveStar{

    constructor(){
        this.name = "five-star";
        this.dataSource = [];
        this.priceMatrix = {matrix:[], fixMatrix:[]}
        this.message={
            BUTTON_UPDATE_CLICK:`update-click`,
            BUTTON_DEL_CLICK:`del-click`,
            BUTTON_VIEW_LENGHT_DETAILS:`view-length-click`,
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
        return [
            {
                title: 'Destination',
                dataIndex: 'destination',
                key: 'destination'
            },
            // {
            //     title: 'Base Price',
            //     dataIndex: 'price',
            //     key: 'price'
            // },
            {
                title: 'Declared Value Rate %',
                dataIndex: 'declaredValueRate',
                key: 'declaredValueRate'
            },
            {
                title: 'Weight Range',
                dataIndex: 'weightRange',
                key: 'weightRange',
                render: (text,row,index)=>(<Button 
                    onClick={()=>{
                        callback({
                            name: this.name,
                            action:this.message.BUTTON_VIEW_WEIGHT_DETAILS,
                            data:row,
                            index
                        })
                    }}
                    size="small" 
                    style={{background:'orange'}}>
                        <span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Show Details</span>
                    </Button>)
            },
            {
                title: 'Length Range',
                dataIndex: 'lengthRange',
                key: 'lengthRange',
                render: (t,row,index)=>(<Button 
                    onClick={()=>{
                        callback({
                            name: this.name,
                            action:this.message.BUTTON_VIEW_LENGHT_DETAILS,
                            data:row,
                            index
                        })
                    }}
                    size="small" 
                    style={{background:'orange'}}>
                        <span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Show Details</span>
                    </Button>)
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                width:150,
                render: (t,row,index)=>(<Button 
                    onClick={()=>{
                        callback({
                            name: this.name,
                            action:this.message.BUTTON_UPDATE_CLICK,
                            data:row,
                            index
                        })
                    }}
                    size="small" 
                    style={{background:'green'}}>
                        <span style={{color:"white", fontWeight:'bold', fontSize:'11px'}}>Update</span>
                    </Button>)
            }
        ]
    }

    getMatrixTable(callback){
        return (
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
            width:250
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
            key: "price",
            width:150
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
            declaredValueRate: val.declaredValueRate,
            lengthRange: val.lengthRange,
            price: val.price,
            weightRange: val.weightRange
        }]
        return matrix;
    }
}

export default FiveStar;