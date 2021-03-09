import React, { useEffect } from "react";
import { Row, Col, Radio, Select, AutoComplete, Space, Divider } from "antd";
import "./createParcelForm.scss";
import { InputView } from "../input";
import { getHeaderColor, UserProfile } from "../../utility";

const { Option } = Select;

function InputBox(props) {
  const disabled = (props.detail && props.detail.disabled) || false;
  const isRequired = (props.detail && props.detail.isRequired) || false;
  const name = (props.detail && props.detail.name) || null;
  const accepted = (props.detail && props.detail.accepted) || false;
  const value = (props.detail && ( (props.detail.value === undefined) ? "" : props.detail.value))

  return (
    <div style={{ marginBottom: ".4rem", minHeight: "55px" }}>
      <span className="input-placeholder-title">
        {`${isRequired ? props.title + "*" : props.title}` || ""}
      </span>
      <InputView
        size="large"
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
        onChange={(e=>props.onChange(e,name))}
      />
    </div>
  );
}

function BicolIsarogForm(props) {
  const {
    senderName,
    senderMobile,
    senderEmail,
    receiverName,
    receiverMobile,
    receiverEmail,
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
    fixMatrix,
    associateORNumber,
    busNumber,
    tripCode,
    driverFullName,
    conductorFullName,
    sticker_quantity,
    discount,
    associateFixPrice,
    billOfLading,
    additionalFee,
    discountFee,
  } = props.details;

  const {
    lengthFee,
    portersFee,
    weightFee,
    handlingFee,
    basePrice,
    isShortHaul,
    declaredValueFee,
    isFixedPrice
  } = props.priceDetails


  const enableInterConnection = props.enableInterConnection;
  const _temList = destination.options.map((e) => e.name);
  const [tempList, setTempList] = React.useState(_temList);

  const doSearch = (el) => {
    const data = destination.options;
    const toSearch = el.toLowerCase();
    const tempParcelData = data
      .filter((e) => {
        return e.name.toLowerCase().includes(toSearch);
      })
      .map((e) => e.name);
    setTempList(tempParcelData);
  };

  return (
    <div className="create-parcel-form">
      {/* <div style={{background: '#fff', width:'100%', display:'flex', justifyContent:'flex-end', alignItems:'center', marginBottom:'1rem' }}>
        <img style={{display:'none', maxHeight:'170px', maxWidth:'250px'}} src={UserProfile.getBusCompanyLogo()} />
        <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-end', marginTop:'1rem', padding:'1rem'}}>
          <Space direction="vertical">
              <Space>
                <div style={{width:90, fontSize:"14px", fontWeight:300}}>Company</div>
                :&nbsp;<span style={{width:80, fontSize:"14px", fontWeight:300}}>{UserProfile.getBusCompanyName()}</span>
              </Space>
              <Space>
              <div style={{width:90, fontSize:"14px", fontWeight:300}}>Full Name</div>
                :&nbsp;<span style={{width:80, fontSize:"14px", fontWeight:300}}>{UserProfile.getPersonFullName()}</span>
              </Space>
              <Space>
                <div style={{width:90, fontSize:"14px", fontWeight:300}}>Address</div>
                :&nbsp;<span style={{width:80, fontSize:"14px", fontWeight:300}}>{UserProfile.getPersonAddress()}</span>
              </Space>
          </Space>
        </div>
      </div> */}
      <div className="input-container-border" style={{ padding: 0, boxShadow: "2px 5px 12px", marginBottom: '2rem' }}>
        <HeaderContainer title="Customers Information" />
        <div style={{ padding: '1rem' }}>
          <Row>
            <Col span={8} className="gutter-row">
              <InputBox
                type="text"
                detail={senderName}
                onChange={props.onChange}
                title="Sender Full Name"
                errorMessage={
                  senderName.errorMessage || "Sender Name is required"
                }
                onBlur={() => props.onBlur(senderName.name)}
                placeholder="Sender Full Name"
              />
            </Col>

            <Col span={8} className="gutter-row">
              <InputBox
                type="tel"
                onBlur={() => props.onBlur(senderMobile.name)}
                detail={senderMobile}
                onChange={props.onChange}
                title="Sender Mobile"
                prefix="+63"
                errorMessage={senderMobile.errorMessage}
                placeholder=""
              />
            </Col>

            <Col span={8} className="gutter-row">
              <InputBox
                detail={senderEmail}
                onChange={props.onChange}
                title="Sender Email"
                onBlur={() => props.onBlur(senderEmail.name)}
                errorMessage="Invalid email"
                showError={senderEmail.hasError || false}
                placeholder="Sender Email"
              />
            </Col>
          </Row>
          <Row>
            <Col span={8} className="gutter-row">
              <InputBox
                type="text"
                onBlur={() => props.onBlur(receiverName.name)}
                detail={receiverName}
                onChange={props.onChange}
                title="Receiver Full Name"
                errorMessage={
                  receiverName.errorMessage || "Receiver Name is required"
                }
                placeholder="Receiver Full Name"
              />
            </Col>

            <Col span={8} className="gutter-row">
              <InputBox
                type="tel"
                onBlur={() => props.onBlur(receiverMobile.name)}
                detail={receiverMobile}
                onChange={props.onChange}
                title="Receiver Mobile"
                prefix="+63"
                errorMessage={receiverMobile.errorMessage}
                placeholder=""
              />
            </Col>

            <Col span={8} className="gutter-row">
              <InputBox
                onBlur={() => props.onBlur(receiverEmail.name)}
                detail={receiverEmail}
                onChange={props.onChange}
                title="Receiver Email"
                showError={receiverEmail.hasError || false}
                errorMessage="Invalid email"
                placeholder="Receiver Email"
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="calculator-container-border" style={{ padding: 0, boxShadow: "2px 5px 12px", marginBottom: '2rem' }}>

        <HeaderContainer title="Select Station" />
        <div style={{ padding: '1rem' }}>
          <Row>
            <Col className="gutter-row" span={8}>
              <div className="select-destination-form-container">
                <span className="input-placeholder-title select-placeholder">
                  Destination*
              </span>
                <AutoComplete
                  size="large"
                  className={`${!destination.accepted ? "select-error-destination-form" : ""}`}
                  dataSource={tempList}
                  style={{ width: "100%" }}
                  onSelect={(e) =>
                    props.onSelectChange(
                      destination.options.find((find) => find.name === e)
                        .endStation,
                      destination.name
                    )
                  }
                  onSearch={doSearch}
                  placeholder="Destination"
                />
                {!destination.accepted && (
                  <span className="select-input-error">
                    {destination.errorMessage || "Destination is required"}
                  </span>
                )}
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
                <span className="input-placeholder-title select-placeholder">
                  Fixed Price
              </span>
                <Select
                  size="large"
                  onBlur={() => props.onBlur(destination.name)}
                  className={`${!fixMatrix.accepted ? "select-error-destination-form" : ""
                    }`}
                  onChange={(e) => props.onSelectChange(e, fixMatrix.name)}
                  value={fixMatrix.value}
                  style={{ width: "100%" }}
                >
                  {fixMatrix.options.map((e) => (
                    <Option key={e.name} value={e.name}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
                {!fixMatrix.accepted && (
                  <span className="select-input-error">
                    {fixMatrix.errorMessage || "Fix price is required"}
                  </span>
                )}
              </div>
            </Col>
          </Row>
          <Row className={`${enableInterConnection ? "" : "hide"}`}>
            <Col className="gutter-row" span={8}>
              <div className="select-destination-form-container">
                <span className="input-placeholder-title select-placeholder">
                  Associate
              </span>
                <Select
                  size="default"
                  onBlur={() => props.onBlur(connectingCompany.name)}
                  className={`${!connectingCompany.accepted
                    ? "select-error-destination-form"
                    : ""
                    }`}
                  onChange={(e) =>
                    props.onSelectChange(e, connectingCompany.name)
                  }
                  value={connectingCompany.value}
                  style={{ width: "100%" }}
                >
                  {connectingCompany.options.map((e) => (
                    <Option key={e._id} value={e._id}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
                {!connectingCompany.accepted && (
                  <span className="select-input-error">
                    {connectingCompany.errorMessage || "Bus Company is required"}
                  </span>
                )}
              </div>
            </Col>

            <Col className="gutter-row" span={8}>
              <div className="select-destination-form-container">
                <span className="input-placeholder-title select-placeholder">
                  Associate Routes
              </span>
                <Select
                  size="default"
                  onBlur={() => props.onBlur(connectingRoutes.name)}
                  className={`${!connectingRoutes.accepted
                    ? "select-error-destination-form"
                    : ""
                    }`}
                  onChange={(e) => props.onSelectChange(e, connectingRoutes.name)}
                  value={connectingRoutes.value}
                  style={{ width: "100%" }}
                >
                  {connectingRoutes.options.map((e) => (
                    <Option key={e.end} value={e.end}>
                      {e.endStationName}
                    </Option>
                  ))}
                </Select>
                {!connectingRoutes.accepted && (
                  <span className="select-input-error">
                    {connectingRoutes.errorMessage || "Bus Company is required"}
                  </span>
                )}
              </div>
            </Col>

            <Col span={8} className="gutter-row">
              <div className="select-destination-form-container">
                <span className="input-placeholder-title select-placeholder">
                  Associate Fix Price
              </span>
                <Select
                  size="default"
                  onBlur={() => props.onBlur(associateFixPrice.name)}
                  className={`${!connectingRoutes.accepted
                    ? "select-error-destination-form"
                    : ""
                    }`}
                  onChange={(e) => props.onSelectChange(e, associateFixPrice.name)}
                  value={associateFixPrice.value}
                  style={{ width: "100%" }}
                >
                  {associateFixPrice.options.map((e) => (
                    <Option key={e.name} value={e.name}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
                {!connectingRoutes.accepted && (
                  <span className="select-input-error">
                    {connectingRoutes.errorMessage || "Bus Company is required"}
                  </span>
                )}
              </div>
            </Col>
          </Row>

        </div>
      </div>

      <div className="calculator-container-border" style={{ padding: 0, boxShadow: "2px 5px 12px" }}>
        <HeaderContainer title="Price Matrix" color="#1d7ab2" />

        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: '1rem' }}>
          <div style={{ width: '65%' }}>
            <div style={{ padding: '.5rem', display: 'flex', flexDirection: 'column',}}>
              <Radio.Group value={type.value} onChange={(e)=>props.onTypeChange(e)} style={{ alignSelf: 'center' }}>
                {type.options.map((e) => (
                  <Radio key={e.value} disabled={e.disabled} value={e.value}>
                    {e.name}
                  </Radio>
                ))}
              </Radio.Group>
              <Divider />
            </div>

            <Row>
              <Col span={8} className="gutter-row">
                <InputBox
                  type="number"
                  onBlur={() => props.onBlur(declaredValue.name)}
                  detail={declaredValue}
                  onChange={props.onChange}
                  title="Declared Value"
                  errorMessage={declaredValue.errorMessage}
                  placeholder="Declared Value"
                />
              </Col>

              <Col span={8} className="gutter-row">
                <InputBox
                  type="number"
                  onBlur={() => props.onBlur(packageWeight.name)}
                  detail={packageWeight}
                  onChange={props.onChange}
                  placeholder="Weight (kg)"
                  errorMessage={packageWeight.errorMessage}
                  title="Weight"
                />
              </Col>

              <Col span={8} className="gutter-row">
              {<InputBox
                type="number"
                onBlur={() => props.onBlur(length.name)}
                detail={length}
                onChange={props.onChange}
                placeholder="Length (meter)"
                errorMessage={length.errorMessage}
                title="Length"
              />}
              </Col>
            </Row>

            <Row>
              <Col span={8} className="gutter-row">
                <InputBox
                  type="number"
                  onBlur={() => props.onBlur(quantity.name)}
                  detail={quantity}
                  onChange={props.onChange}
                  title="Quantity"
                  errorMessage={quantity.errorMessage}
                  placeholder="Quantity"
                />
              </Col>

              <Col span={8} className="gutter-row">
                <InputBox
                  type="number"
                  onBlur={() => props.onBlur(sticker_quantity.name)}
                  detail={sticker_quantity}
                  onChange={props.onChange}
                  title="Package Count"
                  errorMessage={sticker_quantity.errorMessage}
                  placeholder="Box / Parcel Count"
                />
              </Col>

              <Col span={8} className="gutter-row">
                <InputBox
                  detail={billOfLading}
                  onChange={props.onChange}
                  errorMessage={billOfLading.errorMessage}
                  title="Bill of Lading"
                  placeholder="Bill of Lading"
                />

              </Col>

            </Row>

            <Row>
              <Col span={8} className="gutter-row">
                <InputBox
                  detail={additionNote}
                  onChange={props.onChange}
                  title="Additional Note"
                  placeholder="Additional Note"
                />

              </Col>

              <Col span={8} className="gutter-row">
                <InputBox
                  type="number"
                  onBlur={() => props.onBlur(paxs.name)}
                  detail={paxs}
                  onChange={props.onChange}
                  errorMessage={paxs.errorMessage}
                  title="Number of Pax"
                  placeholder="Number of Pax"
                />

              </Col>

              <Col span={8} className="gutter-row">
                <span className="input-placeholder-title select-placeholder">
                  Discount Type
                  </span>
                <Select
                  size="large"
                  disabled={discount.disabled}
                  onChange={(e) => props.onSelectChange(e, discount.name)}
                  value={discount.value}
                  style={{ width: "100%" }}
                >
                  {discount.options.map((e) => (
                    <Option key={e.name} value={e.name}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Row>
              {
                additionalFee.enabled &&
                <Col span={8} className="gutter-row">
                  <InputBox
                    type="number"
                    onBlur={() => props.onBlur(additionalFee.name)}
                    detail={additionalFee}
                    onChange={props.onChange}
                    title="Additional Fee*"
                    errorMessage={additionalFee.errorMessage}
                    placeholder="Additional Fee"
                  />
                </Col>
              }
            </Row>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '35%', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginLeft: '1rem', borderLeft: 'solid 1px rgba(56,56,56,.1)' }}>
            <div style={{ alignSelf:'center', fontSize: 18, fontWeight:400, marginBottom:'2.5rem'}}>Payment Breakdown</div>

            
            {UserProfile.getBusCompanyTag() === "five-star" &&
              <ShowFiveStarBreakDown data={{
                ...props.priceDetails, 
                  isFixedPrice,
                  systemFee:Number(systemFee.value).toFixed(2)
              }}/>
            }
            {UserProfile.getBusCompanyTag() === "isarog-liner" &&
              <ShowBicolIsarogBreakDown 
                data={{
                  ...props.priceDetails, 
                  isFixedPrice,
                  systemFee:Number(systemFee.value).toFixed(2)
                }} /> 
            }
            {
              UserProfile.getBusCompanyTag() === "dltb" && 
              <ShowDltbBreakDown 
                data={{
                  ...props.priceDetails, 
                  isFixedPrice,
                  additionalFee: Number(additionalFee.value).toFixed(2), 
                  systemFee:Number(systemFee.value).toFixed(2)
                }} 
              />
            }
            {/* {<TextContainer title="Insurance Fee" value={Number(packageInsurance.value).toFixed(2)} />} */}
           
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{ fontStyle: 'italic', textAlign: 'left', fontSize: 15, fontWeight:"bold" }}><label>Total Shipping Cost</label></div>
              <div style={{fontSize: 17, textAlign: 'right', fontWeight: 'bold' }}><label> ₱ {Number(totalShippingCost.value).toFixed(2)}</label></div>
            </div>
          </div>
        </div>

      </div>

      <div className="input-container-border" style={{ display: 'none' }}>
        <h4 className="create-group-title">Bus Information</h4>

        <Row>
          <Col style={{ display: "none" }} span={12} className="gutter-row">
            <InputBox
              type="text"
              detail={tripCode}
              onChange={props.onChange}
              errorMessage={tripCode.errorMessage || "Trip Code is required"}
              title="Trip Code"
              placeholder="Trip Code"
            />
          </Col>
        </Row>

        <Row >
          <Col span={8} className="gutter-row">
            <InputBox
              type="text"
              detail={busNumber}
              onChange={props.onChange}
              errorMessage={busNumber.errorMessage || "Bus Number is required"}
              title="Bus No."
              placeholder="Bus Number"
            />
          </Col>
          <Col span={8} className="gutter-row">
            <InputBox
              type="text"
              detail={driverFullName}
              onChange={props.onChange}
              errorMessage={
                driverFullName.errorMessage || "Sender Name is required"
              }
              onBlur={() => props.onBlur(driverFullName.name)}
              title="Driver Full Name"
              placeholder="ex: Juan Dele Cruz"
              showError={driverFullName.hasError || false}
            />
          </Col>
          <Col span={8} className="gutter-row">
            <InputBox
              type="text"
              detail={conductorFullName}
              onChange={props.onChange}
              errorMessage={
                conductorFullName.errorMessage || "Sender Name is required"
              }
              onBlur={() => props.onBlur(conductorFullName.name)}
              title="Conductor Full Name"
              placeholder="ex. Juan Dela Cruz"
              showError={conductorFullName.hasError || false}
            />
          </Col>
        </Row>
      </div>

    </div>
  );
}

const translateNumber = (val)=>{
  if(!val || val === undefined || val === 'NaN' || val === null){
    return  Number(0).toFixed(2)
  }
  return val;
}

function ShowBicolIsarogBreakDown(props){
  let view = undefined;
    const{
      basePrice,
      declaredValueFee,
      systemFee,
      isFixedPrice,
      lengthFee,
      discountFee,
      portersFee,
      weightFee,
    }=props.data;

    if(isFixedPrice){
      view=(<>
        <TextContainer title="Base Price" value={translateNumber(basePrice)} /> 
        <TextContainer title="Declared Value Fee" value={translateNumber(declaredValueFee)} /> 
        <TextDiscountContainer title="Discount" value={translateNumber(discountFee)} /> 
        <TextContainer title="System Fee" value={translateNumber(systemFee)} />
        <TextContainer title="Porters Fee" value={translateNumber(portersFee)} /> 
      </>)
    }else{
      view=(<>
          <TextContainer title="Base Price" value={translateNumber(basePrice)} /> 
          <TextContainer title="Weight Fee" value={translateNumber(weightFee)} />
          <TextContainer title="Length Fee" value={translateNumber(lengthFee)} />
          <TextContainer title="Declared Value Fee" value={translateNumber(declaredValueFee)} /> 
          <TextContainer title="System Fee" value={translateNumber(systemFee)} />
          <TextContainer title="Porters Fee" value={translateNumber(portersFee)} />
          <TextDiscountContainer title="Discount" value={translateNumber(discountFee)} /> 
      </>)
    }

    return(view)
}


function ShowFiveStarBreakDown(props){
  let view = undefined;
    const{
      weightFee,
      basePrice,
      declaredValueFee,
      systemFee,
      isFixedPrice,
      lengthFee,
      discountFee
    }=props.data;

    if(isFixedPrice){
      view=(<>
        <TextContainer title="Base Price" value={translateNumber(basePrice)} /> 
        <TextContainer title="Declared Value Fee" value={translateNumber(declaredValueFee)} /> 
        <TextContainer title="System Fee" value={translateNumber(systemFee)} />
        <TextDiscountContainer title="Discount" value={translateNumber(discountFee)} /> 
      </>)
    }else{
      view=(<>
        <TextContainer title="Weight Fee" value={translateNumber(weightFee)} /> 
        <TextContainer title="Length Fee" value={translateNumber(lengthFee)} />
        <TextContainer title="Declared Value Fee" value={translateNumber(declaredValueFee)} />
        <TextContainer title="System Fee" value={translateNumber(systemFee)} />
        <TextDiscountContainer title="Discount" value={translateNumber(discountFee)} /> 
      </>)
    }

    return(view)
    
}

function ShowDltbBreakDown(props){
  let view = undefined;
    const{
      weightFee,
      handlingFee,
      basePrice,
      isShortHaul,
      declaredValueFee,
      systemFee,
      insuranceFee,
      additionalFee,
      isFixedPrice
    }=props.data;
  
    if(isShortHaul || isFixedPrice){
      view = (<>
        <TextContainer title="Base Price" value={translateNumber(basePrice)} /> 
        <TextContainer title="Additional Fee" value={translateNumber(additionalFee)} />
        <TextContainer title="Declared Value Fee" value={translateNumber(declaredValueFee)} /> 
        <TextContainer title="System Fee" value={translateNumber(systemFee)} />
      </>)
    }else{
      view = (<>
        <TextContainer title="Base Price" value={translateNumber(basePrice)} /> 
        <TextContainer title="Weight Fee" value={translateNumber(weightFee)} /> 
        <TextContainer title="Additional Fee" value={translateNumber(additionalFee)} /> 
        <TextContainer title="Handling Fee" value={translateNumber(handlingFee)} /> 
        <TextContainer title="Insurance Fee" value={translateNumber(insuranceFee)} />
        <TextContainer title="Declared Value Fee" value={translateNumber(declaredValueFee)} /> 
        <TextContainer title="System Fee" value={translateNumber(systemFee)} />
      </>)
    }

    return(view)
}

function TextContainer(props) {
  return (<div style={{ display:'flex', justifyContent:'space-between', borderBottom: "1px solid rgba(56,56,56,0.1)", marginBottom: '2px' }}>
    <div style={{ fontStyle: 'italic', textAlign: 'left', fontSize: 15 }}><label>{props.title}</label></div>
    <div style={{ fontSize: 15, textAlign: 'right' }}><label> ₱ {props.value}</label></div>
  </div>)
}

function TextDiscountContainer(props) {
  return (<div style={{ display:'flex', justifyContent:'space-between', borderBottom: "1px solid rgba(56,56,56,0.1)", marginBottom: '2px' }}>
    <div style={{ fontStyle: 'italic', textAlign: 'left', fontSize: 15, width: 200 }}><label>{props.title}</label></div>
    <div style={{ fontSize: 15, textAlign: 'right', width: 110 }}><label> - ₱ {props.value}</label></div>
  </div>)
}

function HeaderContainer(props) {
  let color = getHeaderColor();
  switch (UserProfile.getBusCompanyTag()) {
    case 'isarog-liner':
      color = "#1d7ab2"
      break;
  
    default:
      color = 'rgb(204, 39, 40)'
      break;
  }
  return (<div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', background: color, display: 'flex', width: '100%', padding: '.5rem' }}>{props.title}</div>)
}


export default BicolIsarogForm;
