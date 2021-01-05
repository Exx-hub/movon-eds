import React, { useEffect, useState } from "react";
import {Collapse,Table,Space,Button,Select, Form, Input, InputNumber} from "antd";
import FooterModal from './modal.footer'

function AddFixMatrixModalContent(props){

    const onFinish = values => {
        let index = -1
        try {
            index = props.data.index
        } catch (error) {
            index = -1
        }
        props.onSubmit(values, index)
      };
    
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };

      const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
      };

    return (
        <>
            <Form 
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{marginBottom:'.2rem', display:'flex', flexDirection:'column'}}
                initialValues={{
                    remember: true,
                    'declaredValue': (props.data && props.data.dvRate) || undefined,
                    'price': (props.data && props.data.price) || undefined,
                    'name': (props.data && props.data.description) || undefined
                  }}
                >

                <Form.Item
                    label="Description"
                    name="name"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <Input disabled={Boolean(props.type === 'delete')} /> 
                </Form.Item>

                <Form.Item
                    label="Declared Value"
                    name="declaredValue"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>
                
                <Form.Item {...tailLayout}>
                    <div style={{display:"flex", justifyContent:'center'}}>
                        <FooterModal 
                            cancelText={props.cancelText || "Cancel"}
                            okText={props.okText || "Save"} 
                            onOk={props.onOk} 
                            onCancel={props.onCancel} />
                    </div>
                </Form.Item>
            </Form>
            
        </>)
}

export default AddFixMatrixModalContent;