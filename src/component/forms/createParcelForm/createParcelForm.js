import React from 'react';
import { Row, Col, Radio, Select, Space } from 'antd';
import './createParcelForm.scss'
import {InputView} from '../../input' 

const { Option } = Select;

function InputBox(props){

  const disabled = (props.detail && props.detail.disabled) || false;
  const isRequired = (props.detail && props.detail.isRequired) || false;
  const name = (props.detail && props.detail.name) || null;
  const accepted = (props.detail && props.detail.accepted) || false;
  const value = (props.detail && props.detail.value) || "";

  return (<div style={{marginBottom:'.6rem', minHeight:'70px'}}>
    <span className="input-placeholder-title">{`${ isRequired  ? props.title + "*" : props.title}`|| ""}</span>
    <InputView
          value={value}
          name={name}
          accepted={accepted}
          isRequired={isRequired}
          title={props.title}
          placeholder={props.placeholder} 
          onBlur={props.onBlur || null}
          disabled={props.disabled || disabled}
          errorMessage={props.errorMessage}
          showError={props.showError}
          prefix ={props.prefix}
          type={props.type}
          onChange={props.onChange} />
    </div>)
}

function CreateParcelForm(props) {

  const{
    senderName,
    senderMobile,
    senderEmail,
    recieverName,
    recieverMobile,
    recieverEmail,
    destination,
    description,
    declaredValue,
    quantity,
    systemFee,
    additionNote,
    packageInsurance,
    type,
    packageWeight,
    shippingCost,
    totalShippingCost,
    paxs
  }=props.details;

  return (
    <div className="create-parcel-form">
        <div className='calculator-container-border'>
          <span className="create-group-title">Select Station</span>
          <Row >
            <Col className="gutter-row" span={12}>
              <div className="select-destination-form-container">
                <span className="input-placeholder-title select-placeholder">Destination*</span>
                <Select
                  size="large"
                  onBlur={()=>props.onBlur(destination.name)}
                  className={`${!destination.accepted ? "select-error-destination-form" : ""}`}
                  onChange={props.onSelectChange} 
                  value={destination.value} 
                  style={{ width: '100%' }}>
                  {
                    destination.options.map(e=>(<Option value={e.value}>{e.name}</Option>))
                  }
                </Select>
                {
                  !destination.accepted && <span className="select-input-error">{destination.errorMessage || 'Destination is required' }</span>
                }
              </div>
            </Col>

            <Col className="gutter-row" span={12}>
              <InputBox 
                detail={description}
                title="Description"
                placeholder="Parcel Description" 
                onChange={props.onChange}
                onBlur={()=>props.onBlur(description.name)}
                />
            </Col>        
          </Row>
        </div>

        <Row>
          <Col span={12} className="gutter-row">
            <div className='input-container-border'>

              <h4 className="create-group-title">Sender</h4>

              <InputBox 
                type="text"
                detail={senderName}
                onChange={props.onChange}
                title="Sender Name"
                errorMessage={senderName.errorMessage || "Sender Name is required" }
                onBlur={()=>props.onBlur(senderName.name)}
                placeholder="Sender Name" />

              <InputBox 
                type='number'
                onBlur={()=>props.onBlur(senderMobile.name)}
                detail={senderMobile}
                onChange={props.onChange}
                title="Sender Mobile"
                prefix="+63"
                errorMessage={senderMobile.errorMessage}
                placeholder="" />

              <InputBox 
                detail={senderEmail}
                showError={senderEmail.hasError || false}
                onChange={props.onChange}
                title="Sender Email"
                errorMessage="Invalid email"
                placeholder="Sender Email" />
                
            </div>
          </Col>

          <Col span={12} className="gutter-row">
            <div className='input-container-border'>

              <h4 className="create-group-title">Reciever</h4>

              <InputBox
                type="text"
                onBlur={()=>props.onBlur(recieverName.name)}
                detail={recieverName}
                onChange={props.onChange} 
                title="Reciever Name"
                errorMessage={recieverName.errorMessage || "Reciever Name is required" }
                placeholder="Reciever Name" />

              <InputBox
                type="number"
                onBlur={()=>props.onBlur(recieverMobile.name)}
                detail={recieverMobile}
                onChange={props.onChange} 
                title="Reciever Mobile"
                prefix="+63"
                errorMessage={recieverMobile.errorMessage}
                placeholder="" />

              <InputBox
                detail={recieverEmail}
                onChange={props.onChange}
                title="Reciever Email"
                showError={recieverEmail.hasError || false}
                errorMessage="Invalid email"
                placeholder="Reciever Email" />
            </div>
          </Col>
        </Row>

        <div className='calculator-container-border'>
          <span className="create-group-title">Pricing</span>
          <Row>
              <Col span={12} className={["gutter-row"]}>
                <div className={["radio-button-group"]}>
                <Radio.Group value={type.value} onChange={props.onTypeChange}>
                {
                  type.options.map(e=><Radio value={e.value}>{e.name}</Radio>)
                }
                </Radio.Group>
                </div>
              </Col>
              <Col span={12} className={["gutter-row"]}>
                <div className="total-shiping-cost">
                  <span className="txt-total-shiping-cost">Total Shipping Cost: {totalShippingCost.value}</span>
                </div>
              </Col>
          </Row>
          <Row>
            <Col span={12} className={["gutter-row"]}>
              <InputBox 
                type="number"
                onBlur={()=>props.onBlur(declaredValue.name)}
                detail={declaredValue}
                onChange={props.onChange}
                title="Declared Value"
                placeholder="Declared Value" />

              <InputBox
                type="number"
                onBlur={()=>props.onBlur(quantity.name)}  
                detail={quantity}
                onChange={props.onChange}
                title="Quantity"
                placeholder="Quantity" />

               <InputBox 
                type="number"
                onBlur={()=>props.onBlur(packageWeight.name)} 
                detail={packageWeight}
                onChange={props.onChange}
                placeholder="Weight (kg)" 
                title="Weight" />


              <InputBox 
                type="number"
                onBlur={()=>props.onBlur(paxs.name)} 
                detail={paxs}
                onChange={props.onChange}
                title="Number of Pax"
                placeholder="Number of Pax" />

            </Col>

            <Col span={12} className={["gutter-row"]}>
              <InputBox 
                disabled={true}
                type="number"
                detail={packageInsurance}
                onChange={props.onChange}
                placeholder="Insurance: 10%" 
                title="Insurance: 10%" />

              <InputBox
                type="number"
                detail={systemFee}
                onChange={props.onChange}
                title="System Fee" 
                disabled={true}
                placeholder="System Fee" />

              <InputBox
                type="number"
                detail={shippingCost}
                onChange={props.onChange}
                title="Shipping Cost"
                placeholder="Shipping Cost" />

                <InputBox 
                detail={additionNote}
                onChange={props.onChange}
                title="Additional Note" 
                placeholder="Additional Note" />
            </Col>
          </Row>
        </div>
    </div>
  );
}

export default CreateParcelForm;