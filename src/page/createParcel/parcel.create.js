import React, { useState } from "react";
import "./parcel.scss";
import { Button, notification, Layout, Breadcrumb, Input, Form, Space, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import isarog from '../../assets/bicol.png'
import Modal from '../../component/modal/matrixModal'
import { useEffect } from "react";

const { Content, Sider, Header } = Layout;
const { TextArea } = Input;

function CreateParcel(props) {

    const [breadCrum,setBredCrum] = useState({})

    useEffect(()=>{
        console.info('props',props)
    },[])

    return (
        <Layout className="parcel-creator-page">

            <Layout>
                <Content style={{background:'white'}}>
                        <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', alignItems:'center', justifyContent:'space-between'}}>
                            <Breadcrumb>
                                <Breadcrumb.Item><a href="/">Dashboard</a></Breadcrumb.Item>
                                <Breadcrumb.Item>create-parcel-v2</Breadcrumb.Item>
                            </Breadcrumb>
                                <Tooltip title="Back to home page" style={{ position:'absolute', width:'100%', float:'right' }}>
                                    <Button size="large"  style={{ height:50, width:50 }} shape="circle" icon={<CloseOutlined style={{fontSize:30}} />} />
                                </Tooltip>
                        </div>
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <img style={{marginBottom:'2rem'}} height={100} width={300} src={isarog} />
                        </div>
                        <Form
                            style={{marginBottom:'4rem'}}
                            name="basic"
                            onFinish={(e) => console.info(e)}
                            onFinishFailed={(e) => console.info(e)}
                            initialValues={{}}>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '2rem', boxShadow:"5px 10px 10px" }}>
                                <div style={{ fontWeight: 'bold', color: 'white', padding: '1rem', borderTopLeftRadius: 10, borderTopRightRadius: 10, display: 'flex', background: '#cc2728', fontSize: 24, width: '100%' }}>Package Information</div>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', background: 'rgba(167, 159, 159, 0.4)' }}>
                                    <div style={{ display: 'flex', width: '60%', flexDirection: 'column', borderRight: "solid rgba(56,56,56,0.2) 1px", padding: '1rem',  marginTop: '1.2rem', marginBottom: '1.2rem' }}>

                                        <Space style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
                                            
                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Destination</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Description</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Fix Price</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Sender Name</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Sender Phone No.</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: false, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Sender Email.</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Receiver Name</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Receiver Phone No.</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                name="declaredValue"
                                                rules={[{ required: false, message: 'This is required field!' }]}>
                                                <Space direction="vertical">
                                                    <label style={{ fontSize: 18, fontWeight: 400 }}>Receiver Email.</label>
                                                    <Input size="large" style={{ width: 230 }} />
                                                </Space>
                                            </Form.Item>
                                        </Space>

                                    </div>

                                    <div style={{ display: 'flex', width: '40%', padding: '1rem' }}>
                                        <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
                                            <Form.Item
                                                name="declaredValue"
                                                style={{ display: 'flex', width: '80%' }}
                                                rules={[{ required: true, message: 'This is required field!' }]}>
                                                <Input disabled={true} size="large" style={{ width: '100%', height: 250 }} />
                                            </Form.Item>
                                            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: "translate3d(-50%,-50%,0)" }}>
                                                Take Picture | upload
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '1rem', boxShadow:"5px 10px 10px"  }}>
                                <div style={{ fontWeight: 'bold', color: 'white', padding: '1rem', borderTopLeftRadius: 10, borderTopRightRadius: 10, display: 'flex', background: '#cc2728', fontSize: 24, width: '100%' }}>Package Information</div>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', background: 'rgba(167, 159, 159, 0.4)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', padding: '1rem' }}>

                                        <div style={{ display: 'flex', width: '60%', flexDirection: 'column', marginTop: '1.2rem', borderRight: "solid gray 1px" }}>
                                            <Space style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>
                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Declared Value</label>
                                                        <Input type="number" addonBefore="₱" size="large" style={{ width: 170 }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>

                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Weight</label>
                                                        <Input type="number" addonAfter="Kg." size="large" style={{ width: 170 }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>
                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Length</label>
                                                        <Input type="number" addonAfter="m" size="large" style={{ width: 170 }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>

                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Package Count</label>
                                                        <Input type="number" size="large" style={{ width: 170, }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>
                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Additional Fee</label>
                                                        <Input type="number" addonBefore="₱" size="large" style={{ width: 170 }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>

                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Quantity</label>
                                                        <Input type="number" size="large" style={{ width: 170 }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: true, message: 'This is required field!' }]}>
                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Number of Paxs</label>
                                                        <Input type="number" size="large" style={{ width: 170 }} />
                                                    </Space>
                                                </Form.Item>

                                                <Form.Item
                                                    name="declaredValue"
                                                    rules={[{ required: false, message: 'This is required field!' }]}>
                                                    <Space direction="vertical">
                                                        <label style={{ fontSize: 18, fontWeight: 400 }}>Additional Note</label>
                                                        <TextArea size="large" style={{ width: 350 }} />
                                                    </Space>
                                                </Form.Item>


                                            </Space>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', width: '40%', padding: '2rem' }}>
                                            <FeeContainer label="Declared Value Fee" value="₱ 10.00" />
                                            <FeeContainer label="Additional Fee" value="₱ 10.00" />
                                            <FeeContainer label="Weight Fee" value="₱ 10.00" />
                                            <FeeContainer label="Length Fee" value="₱ 10.00" />
                                            <FeeContainer label="Porter's Fee" value="₱ 10.00" />
                                            <FeeContainer label="System Fee" value="₱ 10.00" />
                                            <Space style={{ marginTop: '1rem' }}>
                                                <div style={{ minWidth: '240px', fontSize: '22px', fontWeight: 'bold' }}>Total Shipping Fee :</div>
                                                <label style={{ color: "green", fontWeight: 'bold', minWidth: '100px', fontSize: '22px' }}>₱ 40.00</label>
                                            </Space>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <Button
                                htmlType="submit"
                                type="dashed"
                                onClick={() => props.onOk}
                                style={{ marginTop: '2rem', fontSize: 20, fontWeight: 'bold', height: 80, width: '100%', }}>Validate Parcel</Button>
                        </Form>
                </Content>
            </Layout>
        </Layout>
    )
}

function FeeContainer(props) {
    return (<Space>
        <div style={{ fontStyle: 'italic', fontWeight: 300, minWidth: '250px', fontSize: '20px', color: 'gray' }}>{props.label} :</div>
        <label style={{ color: "gray", fontWeight: 'bold', minWidth: '100px', fontSize: '18px' }}>{props.value}</label>
    </Space>)
}

export default CreateParcel;
