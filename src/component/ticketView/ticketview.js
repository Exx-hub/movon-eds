import React from 'react';
import './ticketview.scss';
import { QRCode } from "react-qr-svg";
import {Row, Col, Divider} from 'antd';
import bicol from '../../assets/bicol.png'
import movon from '../../assets/movon3.png';

const TicketDetails = () =>{
    return <div className="ticket-details">
    <Row>
        <Col>
            <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 110 }}
                value="some text"
            />
        </Col>
        <Col>
            <div className="image-logo-container">
                <img src={movon} className="movon-logo"/>
                <img src={bicol} className="partner-logo"/>
            </div>
            <div className="code-date-container">
                <span className="code-date-container-item1">June 23, 2020</span>
                <span className="code-date-container-item2">SP-E0RTQP3COW</span>
            </div>
        </Col>
    </Row>

    <Divider />

    <Row className="parcel-details-container">
        <Col span={10}  className="to-bold">
            <h5>Bill of Lading:</h5>
            <h5>Trip Code:</h5>
            <h5>Chargeable wt.:</h5>
            <h5>Insurance:</h5>
            <h5>Shipping Cost:</h5>
            <h5>Total Shipping Cost:</h5>
        </Col>
        <Col className="title">
            <h5>loren itsup</h5>
            <h5>trip0001</h5>
            <h5>100</h5>
            <h5>100</h5>
            <h5>100</h5>
            <h5>300</h5>
        </Col>
    </Row>

    <Divider />

    <Row>
        <Col offset={3} span={10} className="to-bold">
            <h5>Sender:</h5>
            <h5>Mobile No:</h5>
            <h5>Receiver:</h5>
            <h5>Mobile No:</h5>
        </Col>
        <Col className="title">
            <h5>Juan Dela Cruz</h5>
            <h5>0916000000</h5>
            <h5>Pedro Penduko</h5>
            <h5>0916000000</h5>
        </Col>
    </Row>

    <Divider />

    <Row>
        <Col offset={0} span={8} className="destination-container">
            <h2 style={{fontWeight:250}}>Destination:</h2>
        </Col>
        <Col>
            <h2 style={{fontWeight:'bold'}}>Manila</h2>
        </Col>
    </Row>
</div>
}

export const TicketView = (props) =>{
    console.log('data', props.data)
    return (<div className="component-ticketview-container">
        <TicketDetails />
        <TicketDetails />
        <TicketDetails />
    </div>);
}