import React, { useEffect, useState } from "react";
import { Collapse, Table, Space, Button, Select, Switch, Form, Input, InputNumber } from "antd";
import FooterModal from './modal.footer'

function AddFixMatrixModalContent(props) {

    console.log('props xxxx', props)

    const onFinish = values => {
        let index = -1
        try {
            index = props.data.index
        } catch (error) {
            index = -1
        }
        const data = {
            index,
            type: props.type
        }
        props.onSubmit(values, data)
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const names = props.data.names.filter(e=> e.name !== props.data.name).map(e=>(e.name.toLowerCase().trim()))

    return (
        <>
            <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ marginBottom: '.2rem', display: 'flex', flexDirection: 'column' }}
                initialValues={{
                    'declaredValue': (props.data && props.data.declaredValue) || 0,
                    'price': (props.data && props.data.price) || 0,
                    'name': (props.data && props.data.name) || "no-data"
                }}
            >

                <Form.Item
                    label="Description"
                    name="name"
                    rules={[{ required: true, message: 'This is required field!' },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            console.info('validation',names.includes(value.toLowerCase().trim()))
                            if (props.type !== 'delete' && names.includes(value.toLowerCase().trim())) {
                                return Promise.reject('Name is already assigned');
                            }
                            return Promise.resolve()
                        },
                    })]}>
                    <Input disabled={Boolean(props.type === 'delete')} />
                </Form.Item>

                <Form.Item
                    label="Declared Value"
                    name="declaredValue"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <div style={{ display: "flex", justifyContent: 'center' }}>
                        <FooterModal
                            enableDelete={Boolean(props.type === "delete")}
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