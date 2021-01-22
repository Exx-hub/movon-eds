import React from "react";
import { Button, Form, Input, InputNumber, Space,  List, Typography } from "antd";
import FooterModal from './modal.footer'
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function MatrixModalContent(props) {

    console.log("MatrixModalContent",props)

    return (<div> 
        <List
            size="small"
            dataSource={props.data.weightRange}
            renderItem={e => {
              const priceDescription = e.amount === 0 ? "Kilo Rate" : "Base Price";
              const amount = e.amount === 0 ? e.kiloRate : e.amount;
              return(
                <List.Item>
                    <div style={{ display:'flex', width:'100%', justifyContent:'space-between'}}>
                        <div style={{ minHeight:'30px', display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                            <span style={{fontSize:14, fontWeight:'bold'}}>{e.weight1} kg</span> &nbsp;-&nbsp; <span style={{fontSize:14, fontWeight:'bold'}}>{e.weight2} kg</span>
                        </div>
                        <div>
                            <span style={{color:'green', fontSize:14, fontWeight:'bold'}}>Php {amount}</span><br/>
                            <span style={{color:'gray', fontSize:10, fontWeight:'bold'}}>{priceDescription}</span>
                        </div>
                    </div>
                </List.Item>)}
                }
          />
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