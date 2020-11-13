import React from "react";
import "./ticketview.scss";
import { QRCode } from "react-qr-svg";
import { Row, Col } from "antd";
import movon from "../../assets/movon3.png";
import moment from "moment";
import { modifyName } from "../../utility";

function TextItem(props) {
  return (
    <Row style={{ marginBottom: ".4rem" }}>
      <Col span={8}>
        <span className="details-title-text">{props.title}</span>
      </Col>
      <Col span={16}>
        <span className="details-value-text">{props.value}</span>
      </Col>
    </Row>
  );
}

const TicketDetails = (props) => {
  const {
    billOfLading,
    packageQty,
    busCompanyLogo,
    endStationName,
    createdAt,
  } = props.value;

  const code = props.code;
  const parcelInfo = props.parcelInfo || [];

  return (
    <div className="ticket-details">
      <Row justify="space-between" style={{ width: "100%" }}>
        <Col span={7} style={{ borderRight: "1px dashed gray" }}>
          <Row justify="center">
            <QRCode
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="Q"
              style={{ width: 120, marginTop: ".8rem" }}
              value={code}
            />
          </Row>
          <Row justify="center" className="scan-code-text">{code}</Row>
          <Row justify="center"><span className="date-created">{moment(createdAt).format("MMM DD, YYYY")}</span></Row>
          
          <Row justify="center">
            {Boolean(props.spCopy) ? (
              <span className="package-indicator-sp">{props.parcelCount}</span>
            ) : (
              <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <span className="package-indicator">
                  {packageQty} <span className="pkg-text">pkg.</span>
                </span>
              <span className="customer-copy-text">{`Customer's Copy`}</span>
              </div>
            )}
          </Row>
        </Col>
        <Col span={17} style={{ paddingLeft: ".5rem" }}>
          <Row justify="space-between" className="image-logo-container">
            <img src={movon} className="movon-logo" alt="movon" />
            <img src={busCompanyLogo} className="partner-logo" alt="partner" />
          </Row>
          {parcelInfo.map((e,i) => (
            <TextItem key={i} title={e.title} value={e.value} />
          ))}
        </Col>
      </Row>
      <Row style={{ height:'100%', borderTop: "1px dashed gray", display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
          <div style={{width:'100%', textAlign:'center'}}>
            <span className="bottom-destination-text">{endStationName}</span>
          </div>  
          <div style={{width:'100%', textAlign:'center'}}><span className="bottom-blNo-text">BL# <span class="bottom-blNo-num">{billOfLading}</span></span>
          </div>
      </Row>
    </div>
  );
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
      noOfSticker,
      scanCode
    } = props.value;

    const parcelInfo = [
      { title: "Sender", value: modifyName(senderName) },
      { title: "Mobile No.", value: senderPhone },
      { title: "Receiver", value: modifyName(recipientName) },
      { title: "Mobile No.", value: recipientPhone },
      { title: "Origin", value: startStationName },
      { title: "Price", value: totalPrice },
    ];

    let _view = [];
    for (let i = 0; i < noOfSticker; i++) {
      _view.push(
        <TicketDetails
          parcelInfo={parcelInfo}
          key={"p-"+i}
          {...props}
          code={scanCode}
        />
      );
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
    } = props.value;

    let _view = [];
    for (let i = 0; i < props.value.subParcels.length; i++) {
      const scanCode = props.value.subParcels[i].subParcelCode;
      const parcelCount = i + 1 + "/" + props.value.subParcels.length;
      const parcelInfo = [
        { title: "Sender", value: modifyName(senderName) },
        { title: "Mobile No.", value: senderPhone },
        { title: "Receiver", value: modifyName(recipientName) },
        { title: "Mobile No.", value: recipientPhone },
        { title: "Origin", value: startStationName },
      ];
      _view.push(
        <TicketDetails
          key={"sp-"+i}
          spCopy={true}
          parcelInfo={parcelInfo}
          {...props}
          code={scanCode}
          parcelCount={parcelCount}
        />
      );
    }
    return _view;
  }
  return null;
};

export const TicketView = (props) => {
  return (
    <div className="component-ticketview-container">
      {props.value && <PCopy {...props} />}
      {props.value && <SpCopy {...props} />}
    </div>
  );
};
