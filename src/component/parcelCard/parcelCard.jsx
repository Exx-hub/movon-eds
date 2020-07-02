import React from 'react';
import {Col, Row} from 'antd';
import './parcelCard.scss';


export const ParcelCard = (props) =>{
    return (<div className="component-parcel-card" 
      onClick={()=>props.onSelect(props.value)}
      >
  
    <div className="parcel-card-top-title">
      <h4 style={{color:'white'}}>QR Code</h4>
      <h4 style={{color:'white'}}>In-Transit</h4>
    </div>
  
    <div className="parcel-img-container">
      <img height={200} width={200} src={'https://parceljs.org/assets/parcel-og.png'} />
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
        <h5>: &nbsp;&nbsp; Socks of Rice</h5>
        <h5>: &nbsp;&nbsp; Sender</h5>
        <h5>: &nbsp;&nbsp; Receiver</h5>
        <h5>: &nbsp;&nbsp; 1</h5>
        <h5>: &nbsp;&nbsp; claimed</h5>
      </Col>
    </Row>
  </div>)
  }