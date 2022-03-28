import React from "react";
import {Form, Input, InputNumber, Switch} from "antd";
import FooterModal from './modal.footer'

function MatrixModalContent(props){
    console.log(props)

    const onFinish = values => {
        console.log(values)
        props.onSubmit(values)
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
                    destination: (props.data && props.data.destination) || undefined,
                    dvRate: (props.data && props.data.dvRate) || 0,
                    addRate: (props.data && props.data.addRate) || 0,
                    basePrice: (props.data && props.data.basePrice) || 0,
                    handlingFee: (props.data && props.data.handlingFee) || 0,
                    weightRate: (props.data && props.data.weightRate) || 0,
                    allowableWeight: (props.data && props.data.allowableWeight) || 0,
                    minDeclaredValue: (props.data && props.data.minDeclaredValue) || 0,
                    insuranceFee: (props.data && props.data.insuranceFee) || 0,
                    isShortHaul: (props.data && props.data.isShortHaul) || false,
                    maxDeclaredValue: (props.data && props.data.maxDeclaredValue) || 0,
                    accompaniedBaggage : props.data.accompaniedBaggage || 0,
                    accompaniedBaggageFee : props.data.accompaniedBaggageFee || 0,
                    accompaniedBaggageBasePrice : props.data.accompaniedBaggageBasePrice || 0,
                  }}
                >

                <Form.Item
                    label="Destination"
                    name="destination"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <Input disabled={Boolean(props.type === 'delete')} /> 
                </Form.Item>

                <Form.Item
                    label="Min Declared Value"
                    name="minDeclaredValue"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Max Declared Value"
                    name="maxDeclaredValue"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Declared Value Rate (%)"
                    name="dvRate"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Insurance Rate (%)"
                    name="insuranceFee"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Handling Fee (per kg)"
                    name="handlingFee"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Additional Rate"
                    name="addRate"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Base Price"
                    name="basePrice"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Allowable Weight"
                    name="allowableWeight"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    // label="Excess Weight Rate"
                    label="Cargo Excess Weight Rate"
                    name="weightRate"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber disabled={Boolean(props.type === 'delete')} style={{width:"100%"}} /> 
                </Form.Item>

                <Form.Item
                    label="Min Accompanied Baggage (Kg)"
                    name="accompaniedBaggage"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber style={{width:'100%'}} min={0}/>
                </Form.Item>

                <Form.Item
                    label="Accompanied Baggage Fee (Php)"
                    name="accompaniedBaggageFee"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber style={{width:'100%'}} min={0}/>
                </Form.Item>

                <Form.Item
                    label="Accompanied Baggage Base Price"
                    name="accompaniedBaggageBasePrice"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber style={{width:'100%'}} min={0}/>
                </Form.Item>

                <Form.Item
                    label="Short Haul"
                    name="isShortHaul"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <Switch defaultChecked={props.data.isShortHaul} /> 
                </Form.Item>
                
                <Form.Item {...tailLayout}>
                    <div style={{display:"flex", justifyContent:'center'}}>
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

export default MatrixModalContent;