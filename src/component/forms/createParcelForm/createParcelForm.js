import React, { useState } from 'react';
import { Layout } from 'antd';
import { Row, Col, Radio } from 'antd';
import './createParcelForm.scss'
import {InputView} from '../../input' 

function InputBox(props){
  return (<>
    <span className="input-placeholder-title">{props.title || ""}</span>
    <InputView
      title={props.title}
      placeholder={props.placeholder} />
    </>)
}

function CreateParcelForm(props) {
  const [state,setState] = useState({accepted:false})

  return (
    <Layout className="create-parcel-form">
        <div className='calculator-container-border'>
          <span className="create-group-title">Select Station</span>
          <Row >
            <Col className="gutter-row" span={12}>
            <InputBox
              title="Destination" 
              placeholder="Destination" />
            </Col>
            <Col className="gutter-row" span={12}>
            <InputBox 
              title="Description"
              placeholder="Parcel Description" />
            </Col>        
          </Row>
        </div>

        <Row>
          <Col span={12} className="gutter-row">
            <div className='input-container-border'>
              <h4 className="create-group-title">Sender</h4>
              <InputBox 
                title="Sender Name"
                placeholder="Sender Name" />
              <InputBox 
                title="Sender Mobile"
                placeholder="Sender Mobile" />
              <InputBox 
                title="Sender Email"
                placeholder="Sender Email" />
            </div>
          </Col>

          <Col span={12} className="gutter-row">
            <div className='input-container-border'>
            <h4 className="create-group-title">Reciever</h4>
              <InputBox 
                title="Reciever Name"
                placeholder="Reciever Name" />
              <InputBox 
                title="Reciever Mobile"
                placeholder="Reciever Mobile" />
              <InputBox 
                title="Reciever Email"
                placeholder="Reciever Email" />
            </div>
          </Col>
        </Row>

        <div className='calculator-container-border'>
          <span className="create-group-title">Pricing</span>
          <Row>
              <Col span={12} className={["gutter-row"]}>
                <div className={["radio-button-group"]}>
                <Radio.Group value={1}>
                  <Radio value={1}>Excess AC</Radio>
                  <Radio value={2}>Execess Non AC</Radio>
                  <Radio value={3}>Cargo</Radio>
                </Radio.Group>
                </div>
              </Col>
              <Col span={12} className={["gutter-row"]}>
                <div className="total-shiping-cost">
                  <span className="txt-total-shiping-cost">Total Shipping Cost:</span>
                </div>
              </Col>
          </Row>
          <Row>
            <Col span={12} className={["gutter-row"]}>
              <InputBox 
                isRequired={true}
                accepted={state.accepted}
                title="Declared Value*"
                onBlur={()=>{setState({accepted:true})}}
                placeholder="Declared Value" />
              <InputBox 
                title="Quantity*"
                placeholder="Quantity" />
              <InputBox
                title="System Fee" 
                placeholder="System Fee" />
              <InputBox 
                title="Additional Note" 
                placeholder="Additional Note" />
            </Col>
            <Col span={12} className={["gutter-row"]}>
              <InputBox 
                placeholder="Package Insurance: 10%" 
                title="Package Insurance: 10% *" />
              <InputBox 
                placeholder="Package Weight (kg)" 
                title="Package Weight" />
              <InputBox 
                title="Shipping Cost"
                placeholder="Shipping Cost" />
              <InputBox 
                title="Number of Pax"
                placeholder="Number of Pax" />
            </Col>
          </Row>
        </div>
    </Layout>
  );
}

export default CreateParcelForm;