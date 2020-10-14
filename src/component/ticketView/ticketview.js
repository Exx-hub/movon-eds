import React from "react";
import "./ticketview.scss";
import { QRCode } from "react-qr-svg";
import { Row, Col } from "antd";
import movon from "../../assets/movon3.png";
import { config } from "../../config";
import moment from "moment";
import { getUser, modifyName } from "../../utility";



function TextItem(props){
    return (
        <Row style={{marginBottom:'.3rem'}}>
            <Col span={8}><span className="details-title-text">{props.title}</span></Col>
            <Col span={16}><span className="details-value-text">{props.value}</span></Col>
        </Row>
    )
}

const TicketDetails = (props) => {
  const {
    billOfLading,
    packageQty,
    busCompanyLogo,
    endStationName,
    createdAt
  } = props.value;

  const code = props.code;
  const parcelInfo = props.parcelInfo || []

  return(<div className="ticket-details">

    <Row justify="space-between" style={{width:'100%'}}>
        <Col span={7} style={{borderRight:"1px dashed gray"}}>
            <Row justify="center">
                <QRCode
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="Q"
                    style={{ width: 120, marginTop:'.8rem' }}
                    value={code} />
            </Row>
            <Row justify="center">
                <span className="date-created">{moment(createdAt).format("MMM DD, YYYY")}</span>
            </Row>
            <Row justify="center">
            {
                Boolean(props.spCopy) ? <span className="package-indicator-sp">1/1</span> : 
                <>
                    <span className="package-indicator"> {packageQty} <span className="pkg-text">pkg.</span> </span>
                    <span className="customer-copy-text">{`Customer's Copy`}</span>
                </>
            }
            </Row>
        </Col>
        <Col span={17} style={{paddingLeft:'.5rem'}}>
            <Row justify="space-between" className="image-logo-container">
                <img src={movon} className="movon-logo" alt="movon" />
                <img src={busCompanyLogo} className="partner-logo" alt="partner" />
            </Row>
            {parcelInfo.map(e=>(<TextItem title={e.title} value={e.value} />))}
        </Col>
    </Row>
    <Row style={{borderTop:"1px dashed gray"}}>
        <Col span={24} style={{ marginBottom:'1rem'}}>
            <Row justify="center"><span className={`bottom-destination-text ${Boolean(props.spCopy)?"sp-copy-margin":""}` }>{endStationName}</span></Row>
            <Row justify="center"><span className="bottom-blNo-text">Bill Of Lading ({billOfLading})</span></Row>
        </Col>
    </Row>
    </div>);
};

const PCopy = (props) => {
  if (props) {
    const {
        recipientName,
        recipientPhone,
        senderName,
        senderPhone,
        startStationName,
        totalPrice,
      } = props.value;

    const quantity = props.value.noOfSticker;
    const scanCode = props.value.scanCode;

    const parcelInfo=[
        {title:"Sender", value:modifyName(senderName)},
        {title:"Mobile No.", value:senderPhone},
        {title:"Reciever", value:modifyName(recipientName)},
        {title:"Mobile No.", value:recipientPhone},
        {title:"Scan Code", value:scanCode},
        {title:"Origin", value: startStationName},
        {title:"Price", value: totalPrice},
    ]

    let _view = [];
    for (let i = 0; i < quantity; i++) {
      _view.push(<TicketDetails parcelInfo={parcelInfo} key={i} {...props} code={scanCode} />);
    }
    return _view;
  }
  return null;
};

const SpCopy = (props) => {
  if (props) {
    const {
        recipientName,
        recipientPhone,
        senderName,
        senderPhone,
        startStationName,
        totalPrice,
      } = props.value;  

    let _view = [];
    for (let i = 0; i < props.value.subParcels.length; i++) {
      const scanCode = props.value.subParcels[i].subParcelCode;
      const parcelInfo=[
        {title:"Sender", value:modifyName(senderName)},
        {title:"Mobile No.", value:senderPhone},
        {title:"Reciever", value:modifyName(recipientName)},
        {title:"Mobile No.", value:recipientPhone},
        {title:"Scan Code", value:scanCode},
        {title:"Origin", value: startStationName},
    ]
      _view.push(
        <TicketDetails spCopy={true} parcelInfo={parcelInfo} key={i} {...props} code={scanCode}>
          <span>
            {i + 1} of {props.value.subParcels.length}
          </span>
        </TicketDetails>
      );
    }
    return _view;
  }
  return null;
};

const CompanyCopy = (props) => {
  if (props) {
    const USER = getUser();
    let noOfStickerCopy = config.ticket.totalCopy;
    if (USER) {
      noOfStickerCopy =
        USER.busCompanyId &&
        USER.busCompanyId.config &&
        USER.busCompanyId.config.parcel.noOfStickerCopy;
    }
    const quantity = noOfStickerCopy || config.ticket.totalCopy;
    const scanCode = props.value.subParcels[0].subParcelCode;

    let _view = [];
    for (let i = 0; i < quantity; i++) {
      _view.push(<TicketDetails key={i} {...props} code={scanCode} />);
    }
    return _view;
  }
  return null;
};

export const TicketView = (props) => {
  return (
    <div className="component-ticketview-container">
      {props.value && <PCopy {...props} />}
      {
          props.value && <SpCopy {...props} />
      }
    </div>
  );
};
