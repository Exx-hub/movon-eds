import React from "react";
import { Button, Form, Input, InputNumber, Space, List } from "antd";
import FooterModal from './modal.footer'
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function MatrixModalContent(props) {

    return (<div>
        <List
            size="small"
            dataSource={props.data.lengthRange}
            renderItem={e => {
                return (
                    <List.Item>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span style={{ fontSize: 14, fontWeight: 'bold' }}>{e.meter}</span> 
                                <span style={{ fontSize: 12, fontWeight: 400, fontStyle:'italic' }}>&nbsp;&nbsp;meter(s)</span>
                            </div>
                            <div>
                                <span style={{ color: 'green', fontSize: 14, fontWeight: 'bold' }}>{e.percentage}%</span><br />
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