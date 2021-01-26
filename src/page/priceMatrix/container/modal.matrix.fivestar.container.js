import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Space } from "antd";
import FooterModal from './modal.footer'
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

function FiveStarMatrixModalContent(props) {

    const onFinish = values => {
        // let _data = {...props.data};
        // delete _data.destination
        // delete _data.destinationId
        // delete _data.originId
        // delete _data.fixMatrix
        // delete values.destination
        props.onSubmit(values, null)
    };

    const onFinishFailed = errorInfo => {
        console.info('Failed:', errorInfo);
    };

    useEffect(()=>{
        console.log('matrix props',props)
    })

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 20 },
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const validateAmount = ({ getFieldValue }) => ({
        validator(rule, value) {
            const reg = /^-{0,1}\d*\.{0,1}\d+$/;
            if(value && !reg.test(value)){
                return Promise.reject('Not allowed')
            }
            return Promise.resolve()
        },
      })


  const validate = ({ getFieldValue }) => ({
        validator(rule, value) {
            var reg = new RegExp('^[0-9]+$');
            if(value && !reg.test(value)){
                return Promise.reject('Not allowed')
            }
            return Promise.resolve()
        },
      })

    return (
        <>
            <Form
                {...layout}
                autoComplete="off"
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ marginBottom: '.2rem', display: 'flex', flexDirection: 'column' }}
                initialValues={{ 
                    destination: props.data.destination || "no data",
                    weightRange: props.data.weightRange || [{weight1:undefined, weight2:undefined, amount:undefined}],
                    lengthRange: props.data.lengthRange || [{meter:undefined, percentage:undefined}],
                    price: props.data.price || 0.00,
                    declaredValueRate : props.data.declaredValueRate || 0
                }}
            >

                <Form.Item
                    label="Destination"
                    name="destination"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <Input disabled={true} />
                </Form.Item>

                {/* <Form.Item
                    label="Base Price"
                    name="price"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber style={{width:'100%'}} min={0}/>
                </Form.Item> */}

                <Form.Item
                    label="Declared Value Rate %"
                    name="declaredValueRate"
                    rules={[{ required: true, message: 'This is required field!' }]}>
                    <InputNumber style={{width:'100%'}} min={0}/>
                </Form.Item>

                <div style={{display:'flex'}}>
                    <div className="ant-col ant-col-6 ant-form-item-label">
                        <label className="ant-form-item-label">Weight Range</label>
                    </div>
                    <Form.List name="weightRange">
                    {(fields, { add, remove }) => (
                        <div className="ant-col ant-col-20 ant-form-item-control" 
                            style={{padding:'.5rem', marginBottom:'1.5rem', border:'dashed 2px #014949a1'}}>
                            {fields.map(field => (
                                <div key={field.key} style={{
                                    height:50,
                                    width:'100%',   
                                    display: 'flex', 
                                    flexDirection:'row', 
                                    alignItems:'center',
                                    justifyContent:'flex-start'}}>

                                    <Form.Item
                                        {...{wrapperCol:1}}
                                        {...field}
                                        style={{marginBottom:5, marginRight:5}}
                                        name={[field.name, 'weight1']}
                                        fieldKey={[field.fieldKey, 'weight1']}
                                        rules={[{ required: true, message: 'required field' },validate]}>
                                        <Input type="number" addonBefore="kg" style={{width:120}} min={0} placeholder="Weight(kg)" />
                                    </Form.Item>

                                    <Form.Item
                                        {...{wrapperCol:1}}
                                        style={{marginBottom:7, marginRight:5}}
                                        {...field}
                                        name={[field.name, 'weight2']}
                                        fieldKey={[field.fieldKey, 'weight2']}
                                        rules={[{ required: true, message: 'required field' },validate]}>
                                        <Input type="number" addonBefore="kg" style={{width:120}} min={0} placeholder="Weight(kg)" />
                                    </Form.Item>

                                    <Form.Item
                                        style={{marginBottom:7, marginRight:5}}
                                        {...{wrapperCol:1}}
                                        {...field}
                                        name={[field.name, 'amount']}
                                        fieldKey={[field.fieldKey, 'amount']}
                                        rules={[{ required: true, message: 'required field' },validateAmount]}>
                                        <Input addonBefore="₱" style={{minWidth:80}} min={0} placeholder="Amount(Php)" />
                                    </Form.Item>

                                    <Form.Item
                                        style={{marginBottom:7, marginRight:5}}
                                        {...{wrapperCol:1}}
                                        {...field}
                                        name={[field.name, 'kiloRate']}
                                        fieldKey={[field.fieldKey, 'kiloRate']}
                                        rules={[{ required: true, message: 'required field' },validateAmount]}>
                                        <Input addonBefore="₱" style={{minWidth:110}} min={0} placeholder="Kilo Rate(Php)" />
                                    </Form.Item>

                                    <Button shape="circle" size="small" style={{background:'#c32020bf'}} onClick={() => remove(field.name)}>
                                        <DeleteOutlined style={{color:'white'}}/>
                                    </Button>
                                    
                                </div>
                            ))}
                            <Form.Item {...{wrapperCol:1}} style={{marginTop:10, marginBottom:0}}>
                                <Button  
                                    block={true} 
                                    type="dashed" 
                                    onClick={() => add()} 
                                    icon={<PlusOutlined />}>
                                    Add Weight
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </Form.List>

                </div>

                <div style={{display:'flex'}}>
                    <div className="ant-col ant-col-6 ant-form-item-label">
                        <label className="ant-form-item-label">Lenght Range</label>
                    </div>
                    <Form.List name="lengthRange">
                    {(fields, { add, remove }) => (
                        <div className="ant-col ant-col-20 ant-form-item-control" 
                            style={{padding:'.5rem', marginBottom:'1.5rem', border:'dashed 2px #014949a1'}}>
                            {fields.map((field, index) => (
                                <div key={field.key} style={{
                                    width:'100%',   
                                    display: 'flex', 
                                    flexDirection:'row', 
                                    height:50,
                                    alignItems:'center',
                                    justifyContent:'flex-start'}}>

                                    <Form.Item
                                        {...{wrapperCol:2}}
                                        {...field}
                                        style={{marginBottom:7, marginRight:5}}
                                        name={[field.name, 'meter']}
                                        fieldKey={[field.fieldKey, 'meter']}
                                        rules={[{ required: true, message: 'Missing lenght' },validate]}
                                    >
                                        <Input type="number" addonAfter="m" style={{width:120}} min={0} placeholder="Lenght(m)" />
                                    </Form.Item>

                                    <Form.Item
                                        style={{marginBottom:7, marginRight:5}}
                                        {...field}
                                        name={[field.name, 'percentage']}
                                        fieldKey={[field.fieldKey, 'percentage']}
                                        rules={[{ required: true, message: 'Missing percent' },validate]}
                                    >
                                        <Input type="number" addonAfter="%" style={{width:120}} min={0} placeholder="Percentage %" />
                                    </Form.Item>
                                    
                                    <Button shape="circle" size="small" style={{background:'#c32020bf'}} onClick={() => remove(field.name)}>
                                        <DeleteOutlined style={{color:'white'}}/>
                                    </Button>

                                </div>
                            ))}
                            <Form.Item {...{wrapperCol:1}} style={{marginTop:10, marginBottom:0}}>
                                <Button  
                                    block={true} 
                                    type="dashed" 
                                    onClick={() => add()} 
                                    icon={<PlusOutlined />}>
                                    Add Length
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </Form.List>

                </div>

               
                <Form.Item {...{wrapperCol:{span:23}}}>
                    <div style={{ display: "flex", justifyContent: 'flex-end', marginTop:'2rem' }}>
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

export default FiveStarMatrixModalContent;