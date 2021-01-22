import React from 'react'
import { ArrowLeftOutlined, NumberOutlined } from "@ant-design/icons";
import { Button, notification, Layout, Steps, Form, Input, Space, Col, Row } from "antd";
import {ParcelHeader} from '../../componentV2/Header'

const { Content, Sider } = Layout;
const { Step } = Steps;
const { TextArea } = Input;

function StepTitle(props){
    return(<div style={{
        display:'flex', 
        borderTopRightRadius:10, 
        borderTopLeftRadius:10,
        height:40,
        background:'teal', 
        width:'100%',
        alignItems:'center'
    }}><span style={{margin:"1rem", fontSize:"18px", color:'#fff'}}>{props.title}</span></div>)
}

function TakePicture(props){
    return (
        <>
            <StepTitle title="Parcel Information" />
            <div style={{width:'100%', display:'flex'}}>
                <div style={{width:'40%', background:'#fff', padding:'1rem'}}>
                    <div style={{border:'dashed 2px gray', marginRight:'1rem'}}>
                        <img style={{height:'100%', width:"100%"}} src="https://lh3.googleusercontent.com/proxy/n32aLpcZFOYk0JftAPuByZ6C8DK3NnDqjCLkR16vOtujM0FEflvKGlLEoS9ClzZbAa7BmPuHwnT159XLyPhc5b0G4wWMmduU2-ie1r7SSAoGZHDtRoCjsymDL2ZwyUrWFACSwWkheZG7M1g" alt="parcel-icon"></img>
                    </div>
                    <div style={{display:'flex', justifyContent:"center", margin:'1rem'}}>
                        <span>Take Photo</span> &nbsp; | &nbsp; 
                        <span>Upload Picture</span>
                    </div>
                </div>
                <div style={{width:'70%', background:'#fff', padding:'1rem'}}>
                        {/* {Sender} */}
                        <div style={{display:'flex', marginTop:'1.5rem'}}>
                            <Form.Item    
                                style={{width:'100%', margin:'2px'}}  
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Sender Full Name*</label>
                                <Input style={{width:"100%"}} /> 
                            </Form.Item>

                            <Form.Item 
                                style={{width:'100%', margin:'2px'}}  
                                {...{wrapperCol: 1}}     
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Sender Mobile*</label>
                                <Input style={{width:"100%"}} /> 
                            </Form.Item>

                            <Form.Item  
                                style={{width:'70%', margin:'2px'}}      
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Sender Email</label>
                                <Input style={{width:"100%"}} /> 
                            </Form.Item>
                        </div>

                        {/* {Receiver} */}
                        <div style={{display:'flex', marginTop:'1rem'}}>
                            <Form.Item    
                                style={{width:'100%', margin:'2px'}}  
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Receiver Full Name*</label>
                                <Input size="large" style={{width:"100%"}} /> 
                            </Form.Item>

                            <Form.Item 
                                style={{width:'100%', margin:'2px'}}  
                                {...{wrapperCol: 1}}     
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Receiver Mobile*</label>
                                <Input size="large" style={{width:"100%"}} /> 
                            </Form.Item>

                            <Form.Item  
                                style={{width:'70%', margin:'2px'}}      
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Receiver Email</label>
                                <Input size="large" style={{width:"100%"}} /> 
                            </Form.Item>
                        </div>

                        {/* {Note} */}
                        <div style={{display:'flex', marginTop:'1rem'}}>
                            <Form.Item  
                                style={{width:'100%', margin:'2px'}}      
                                name="declaredValue"
                                rules={[{ required: true, message: 'This is required field!' }]}>
                                <label style={{fontSize:'17px'}}>Additional Note</label>
                                <TextArea rows={5} size="large" style={{width:"100%"}} /> 
                            </Form.Item>
                        </div>
                </div>
            </div>
            <><Button type="dashed" size="large" style={{width:'100%'}}>Next</Button></>
        </>)
}

function FreightComputationView(){
    return(
    <div>
        <div style={{display:'flex', width:"100%", height:'100%'}}>
            <div style={{width:'60%'}}>
                <div style={{display:'flex', marginTop:'1.2rem'}}>
                    <Form.Item    
                        style={{width:'100%', margin:'2px'}}  
                        name="declaredValue"
                        rules={[{ required: true, message: 'This is required field!' }]}>
                        <label style={{fontSize:'17px'}}>Sender Full Name*</label>
                        <Input size="large" style={{width:"100%"}} /> 
                    </Form.Item>

                    <Form.Item 
                        style={{width:'100%', margin:'2px'}}  
                        {...{wrapperCol: 1}}     
                        name="declaredValue"
                        rules={[{ required: true, message: 'This is required field!' }]}>
                        <label style={{fontSize:'17px'}}>Sender Mobile*</label>
                        <Input size="large" style={{width:"100%"}} /> 
                    </Form.Item>

                    <Form.Item  
                        style={{width:'70%', margin:'2px'}}      
                        name="declaredValue"
                        rules={[{ required: true, message: 'This is required field!' }]}>
                        <label style={{fontSize:'17px'}}>Sender Email</label>
                        <Input size="large" style={{width:"100%"}} /> 
                    </Form.Item>
                </div>

                <div style={{display:'flex', marginTop:'1.2rem'}}>
                    <Form.Item    
                        style={{width:'100%', margin:'2px'}}  
                        name="declaredValue"
                        rules={[{ required: true, message: 'This is required field!' }]}>
                        <label style={{fontSize:'17px'}}>Sender Full Name*</label>
                        <Input size="large" style={{width:"100%"}} /> 
                    </Form.Item>

                    <Form.Item 
                        style={{width:'100%', margin:'2px'}}  
                        {...{wrapperCol: 1}}     
                        name="declaredValue"
                        rules={[{ required: true, message: 'This is required field!' }]}>
                        <label style={{fontSize:'17px'}}>Sender Mobile*</label>
                        <Input size="large" style={{width:"100%"}} /> 
                    </Form.Item>

                    <Form.Item  
                        style={{width:'70%', margin:'2px'}}      
                        name="declaredValue"
                        rules={[{ required: true, message: 'This is required field!' }]}>
                        <label style={{fontSize:'17px'}}>Sender Email</label>
                        <Input size="large" style={{width:"100%"}} /> 
                    </Form.Item>
                </div>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', alignSelf:'flex-end', width:'40%', background:'red', padding:'2rem'}}>
                <Space direction="horizontal">
                    <div style={{width:200, fontSize:20}}>Declared Value Fee:</div>
                    <span>0.00</span>
                </Space>
                <Space direction="horizontal">
                    <div style={{width:200, fontSize:20}}>Length Fee:</div>
                    <span>0.00</span>
                </Space>
                <Space direction="horizontal">
                    <div style={{width:200, fontSize:20}}>Weight Fee:</div>
                    <span>0.00</span>
                </Space>
                <Space direction="horizontal">
                    <div style={{width:200, fontSize:20}}>Shipping Cost:</div>
                    <span>0.00</span>
                </Space>
                <Space direction="horizontal">
                    <div style={{width:200, fontSize:20}}>Total:</div>
                    <div>0.00</div> 
                </Space>
            </div>
        </div>
    </div>)
}



function Parcel(props){
    return(<Layout>
        <ParcelHeader {...props} title="Home" onNavigation={()=>props.history.push("/")}> <span>Hi Ronnie! </span> </ParcelHeader>
        <div style={{display:'flex', margin:'2rem'}} >
            <Form 
                name="basic"
                onFinish={(e)=>console.info(e)}
                onFinishFailed={(e)=>console.info(e)}
                style={{marginBottom:'.2rem', display:'flex', flexDirection:'column'}}
                initialValues={{}}>
                <Steps direction="vertical" current={1}>
                    <Step description={ <TakePicture {...props} /> }/>
                    <Step title="In Progress" description={<FreightComputationView />} />
                    <Step title="Waiting" description="This is a description." />
                </Steps>
                <Button 
                    htmlType="submit"
                    shape="round" 
                    onClick={()=>props.onOk}
                    style={{fontWeight:'bold', width:150, backgroundColor:'#43b73e', color:'#fff'}}>{props.okText || "Ok"}</Button>
            </Form>
        </div>
    </Layout>)
}

export default Parcel;