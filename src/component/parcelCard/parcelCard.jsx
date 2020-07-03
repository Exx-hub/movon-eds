import React from 'react';
import { Col, Row } from 'antd';
import './parcelCard.scss';
import {config} from '../../config'


export const ParcelCard = (props) => {
  console.log('ParcelCard props', props)
      const{
        key,
        qrcode,
        description,
        sender,
        receiver,
        qty,
        travelStatus,
        packageImg
    }=props.value

  return (<div className="component-parcel-card"
    onClick={() => props.onSelect(props.value)}
  >

    <div className="parcel-card-top-title">
      <h4>{qrcode}</h4>
    </div>

    <div className="parcel-img-container">
      <img style={{width:'100%', width:'100%'}} src={packageImg[0]} />
    </div>

    <Row className='card-row-text'>
      <Col span={7} className="card-col-text">
        <h5>Description</h5>
        <h5>Sender</h5>
        <h5>Receiver</h5>
        <h5>Qty</h5>
        <h5>Status</h5>
      </Col>
      <Col className="card-col-text">
        <h5>: &nbsp;&nbsp; {description}</h5>
        <h5>: &nbsp;&nbsp; {sender}</h5>
        <h5>: &nbsp;&nbsp; {receiver}</h5>
        <h5>: &nbsp;&nbsp; {qty}</h5>
        <h5>: &nbsp;&nbsp; {travelStatus}</h5>
      </Col>
    </Row>
  </div>)
}