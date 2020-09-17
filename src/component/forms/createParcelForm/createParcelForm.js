import React from 'react';
import { Row, Col, Radio, Select } from 'antd';
import './createParcelForm.scss'
import { InputView } from '../../input'

const { Option } = Select;

function InputBox(props) {

  const disabled = (props.detail && props.detail.disabled) || false;
  const isRequired = (props.detail && props.detail.isRequired) || false;
  const name = (props.detail && props.detail.name) || null;
  const accepted = (props.detail && props.detail.accepted) || false;
  const value = (props.detail && props.detail.value) || "";

  return (<div style={{ marginBottom: '.4rem', minHeight: '55px' }}>
    <span className="input-placeholder-title">{`${isRequired ? props.title + "*" : props.title}` || ""}</span>
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
      prefix={props.prefix}
      type={props.type}
      onChange={props.onChange} />
  </div>)
}

function CreateParcelForm(props) {

  const {
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
    paxs,
    length,
    connectingCompany,
    connectingRoutes,
    fixMatrix
  } = props.details;

  const enableInterConnection = props.enableInterConnection

  return (
    <div className="create-parcel-form">
      
      <div className='calculator-container-border'>
        <span className="create-group-title">Select Station</span>
        <Row >
          <Col className="gutter-row" span={8}>
            <div className="select-destination-form-container">
              <span className="input-placeholder-title select-placeholder">Destination*</span>
              <Select
                size="default"
                onBlur={() => props.onBlur(destination.name)}
                className={`${!destination.accepted ? "select-error-destination-form" : ""}`}
                onChange={(e) => props.onSelectChange(e, destination.name)}
                value={destination.value}
                style={{ width: '100%' }}>
                {
                  destination.options.map(e => (<Option key={e.value} value={e.value}>{e.name}</Option>))
                }
              </Select>
              {
                !destination.accepted && <span className="select-input-error">{destination.errorMessage || 'Destination is required'}</span>
              }
            </div>
          </Col>

          <Col className="gutter-row" span={8}>
            <InputBox
              detail={description}
              title="Description"
              placeholder="Parcel Description"
              onChange={props.onChange}
              onBlur={() => props.onBlur(description.name)}
            />
          </Col>

          <Col className="gutter-row" span={8}>
          <div className="select-destination-form-container">
            <span className="input-placeholder-title select-placeholder">Fixed Price</span>
            <Select
              size="default"
              onBlur={() => props.onBlur(destination.name)}
              className={`${!fixMatrix.accepted ? "select-error-destination-form" : ""}`}
              onChange={(e) => props.onSelectChange(e, fixMatrix.name)}
              value={fixMatrix.value}
              style={{ width: '100%' }}>
              {
                fixMatrix.options.map(e => (<Option key={e.name} value={e.name}>{e.name}</Option>))
              }
            </Select>
            {
              !destination.accepted && <span className="select-input-error">{destination.errorMessage || 'Destination is required'}</span>
            }
          </div>
        </Col>

        </Row>
        <Row className={`${enableInterConnection ? "" : "hide"}`} >
          <Col className="gutter-row" span={12}>
            <div className="select-destination-form-container">
              <span className="input-placeholder-title select-placeholder">Associate Routes</span>
              <Select
                size="default"
                onBlur={() => props.onBlur(connectingRoutes.name)}
                className={`${!connectingRoutes.accepted ? "select-error-destination-form" : ""}`}
                onChange={(e) => props.onSelectChange(e, connectingRoutes.name)}
                value={connectingRoutes.value}
                style={{ width: '100%' }}>
                {
                  connectingRoutes.options.map(e => (<Option key={e.end} value={e.end}>{e.endStationName}</Option>))
                }
              </Select>
              {
                !connectingRoutes.accepted && <span className="select-input-error">{connectingRoutes.errorMessage || 'Bus Company is required'}</span>
              }
            </div>
          </Col>

          <Col className="gutter-row" span={12}>
            <div className="select-destination-form-container">
              <span className="input-placeholder-title select-placeholder">Associate</span>
              <Select
                size="default"
                onBlur={() => props.onBlur(connectingCompany.name)}
                className={`${!connectingCompany.accepted ? "select-error-destination-form" : ""}`}
                onChange={(e) => props.onSelectChange(e, connectingCompany.name)}
                value={connectingCompany.value}
                style={{ width: '100%' }}>
                {
                  connectingCompany.options.map(e => (<Option key={e._id} value={e._id}>{e.name}</Option>))
                }
              </Select>
              {
                !connectingCompany.accepted && <span className="select-input-error">{connectingCompany.errorMessage || 'Bus Company is required'}</span>
              }
            </div>
          </Col>
        </Row>
      </div>

      <div className='calculator-container-border'>
        <span className="create-group-title">Pricing</span>
        <Row>
          <Col span={12} className={["gutter-row"]}>
            <div className={["radio-button-group"]}>
              <Radio.Group value={type.value} onChange={props.onTypeChange}>
                {
                  type.options.map(e => <Radio disabled={e.disabled} key={e.value} value={e.value}>{e.name}</Radio>)
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
              onBlur={() => props.onBlur(declaredValue.name)}
              detail={declaredValue}
              onChange={props.onChange}
              title="Declared Value"
              errorMessage={declaredValue.errorMessage}
              placeholder="Declared Value" />

            <InputBox
              type="number"
              onBlur={() => props.onBlur(quantity.name)}
              detail={quantity}
              onChange={props.onChange}
              title="Quantity"
              errorMessage={quantity.errorMessage}
              placeholder="Box / Parcel Count" />

            <InputBox
              type="number"
              onBlur={() => props.onBlur(packageWeight.name)}
              detail={packageWeight}
              onChange={props.onChange}
              placeholder="Weight (kg)"
              errorMessage={packageWeight.errorMessage}
              title="Weight" />

            {
              !enableInterConnection &&
              <InputBox
                className={`${length ? "" : "hide"}`}
                type="number"
                onBlur={() => props.onBlur(paxs.name)}
                detail={length}
                onChange={props.onChange}
                errorMessage={paxs.errorMessage}
                title="Length in Meter"
                placeholder="length" />
            }

            <InputBox
              type="number"
              onBlur={() => props.onBlur(paxs.name)}
              detail={paxs}
              onChange={props.onChange}
              errorMessage={paxs.errorMessage}
              title="Number of Pax"
              placeholder="Number of Pax" />

          </Col>

          <Col span={12} className={["gutter-row"]}>

            <InputBox
              disabled={true}
              type="number"
              detail={packageInsurance}
              onChange={props.onChange}
              placeholder={packageInsurance.placeholder || "Insurance: 10%"}
              title={packageInsurance.placeholder || "Insurance: 10%"} />

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

      <Row>
        <Col span={12} className="gutter-row">
          <div className='input-container-border'>

            <h4 className="create-group-title">Sender</h4>

            <InputBox
              type="text"
              detail={senderName}
              onChange={props.onChange}
              title="Sender Name"
              errorMessage={senderName.errorMessage || "Sender Name is required"}
              onBlur={() => props.onBlur(senderName.name)}
              placeholder="Sender Name" />

            <InputBox
              type='number'
              onBlur={() => props.onBlur(senderMobile.name)}
              detail={senderMobile}
              onChange={props.onChange}
              title="Sender Mobile"
              prefix="+63"
              errorMessage={senderMobile.errorMessage}
              placeholder="" />

            <InputBox
              detail={senderEmail}
              onChange={props.onChange}
              title="Sender Email"
              onBlur={() => props.onBlur(senderEmail.name)}
              errorMessage="Invalid email"
              showError={senderEmail.hasError || false}
              placeholder="Sender Email" />

          </div>
        </Col>

        <Col span={12} className="gutter-row">
          <div className='input-container-border'>

            <h4 className="create-group-title">Reciever</h4>

            <InputBox
              type="text"
              onBlur={() => props.onBlur(recieverName.name)}
              detail={recieverName}
              onChange={props.onChange}
              title="Reciever Name"
              errorMessage={recieverName.errorMessage || "Reciever Name is required"}
              placeholder="Reciever Name" />

            <InputBox
              type="number"
              onBlur={() => props.onBlur(recieverMobile.name)}
              detail={recieverMobile}
              onChange={props.onChange}
              title="Reciever Mobile"
              prefix="+63"
              errorMessage={recieverMobile.errorMessage}
              placeholder="" />

            <InputBox
              onBlur={() => props.onBlur(recieverEmail.name)}
              detail={recieverEmail}
              onChange={props.onChange}
              title="Reciever Email"
              showError={recieverEmail.hasError || false}
              errorMessage="Invalid email"
              placeholder="Reciever Email" />
          </div>
        </Col>
      </Row>

    </div>
  );
}

export default CreateParcelForm;

