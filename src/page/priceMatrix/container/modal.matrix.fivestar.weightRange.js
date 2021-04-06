import React from "react";
import {  List } from "antd";
import FooterModal from './modal.footer'

function MatrixModalContent(props) {

    return (<div>
        <List
            size="small"
            dataSource={props.data.weightRange}
            renderItem={e => {
                return (
                    <List.Item>
                        <div style={{ display: 'flex', width: '100%', alignItems:'center', justifyContent: 'space-between' }}>
                            <div style={{display:'flex'}}>
                                <div style={{ marginRight:'2rem', display:'flex', flexDirection:'column', minWidth:'50px', alignItems:'center', justifyContent:'center'}}>
                                   
                                    <span style={{ color:'orange', fontSize: 17, fontWeight: 'bold',  }}>{e.weight1}</span> 
                                    <span style={{ fontSize: 8, fontWeight: 'bold' }}>range 1</span> 
                                    
                                </div>
                                <div style={{ display:'flex', flexDirection:'column', minWidth:'50px', alignItems:'center', justifyContent:'center'}}>
                                   
                                   <span style={{ color:'orange', fontSize: 17, fontWeight: 'bold',  }}>{e.weight2}</span> 
                                   <span style={{ fontSize: 8, fontWeight: 'bold' }}>range 2</span> 
                                   
                               </div>
                            </div>
                            <div style={{display:'flex'}}>
                                <div style={{ marginRight:'2rem', display:'flex', flexDirection:'column', minWidth:'50px', alignItems:'center', justifyContent:'center'}}>
                                   
                                    <span style={{  color:'green', fontSize: 17, fontWeight: 'bold',  }}>{e.amount}</span> 
                                    <span style={{ fontSize: 8, fontWeight: 'bold' }}>Amount</span> 
                                    
                                </div>
                                <div style={{ display:'flex', flexDirection:'column', minWidth:'50px', alignItems:'center', justifyContent:'center'}}>
                                   
                                   <span style={{ color:'green', fontSize: 17, fontWeight: 'bold',  }}>{e.kiloRate}</span> 
                                   <span style={{ fontSize: 8, fontWeight: 'bold' }}>Kilo Rate</span> 
                                   
                               </div>
                            </div>
                        </div>
                    </List.Item>)
            }
            }
        />
        <div style={{ marginTop: '2rem', display: "flex", justifyContent: 'flex-end' }}>
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