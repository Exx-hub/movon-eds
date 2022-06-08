import React from "react";
import "./ticketview.scss";
import { QRCode } from "react-qr-svg";
import { Row, Col } from "antd";
import moment from "moment";
import { modifyName, UserProfile, getStickerLogoBw } from "../../utility";

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

// TicketDetails component
const TicketDetails = (props) => {
  const {
    billOfLading,
    packageQty,
    totalPrice,
    endStationName,
    createdAt,
    cashier,
    transactionDate,
    busNumber // testing for dltb ticketview 
  } = props.value;

  // console.log("ticketDEtails PROPS:", props);
  console.log("CREATED AT:", createdAt);
  console.log("TRANSACTION DATE:", transactionDate);
  // console.log(moment(undefined).format("MMM DD, YYYY"));

  const code = props.code;
  const parcelInfo = props.parcelInfo || [];
  const copy = props.copy;

  return (
    <div className="ticket-details">
      <Row justify="space-between" style={{ width: "100%" }}>
         {/* QRCODE AND CODE  */}
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
          <Row justify="center" className="scan-code-text">
            {code}
          </Row>
         
         {/* DETAILS below QRCODE and CODE */}
          <Row justify="center">
            {Boolean(props.spCopy) ? (
              <span className="package-indicator-sp">{props.parcelCount}</span>
            ) : (
              <div
                className="right-text"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="package-indicator">
                  {packageQty} <span className="pkg-text">pkg.</span>
                </span>
                <Row justify="center" className="price-text">
                  {" "}
                  Price:&nbsp;<b>{totalPrice.toFixed(2)}</b>
                </Row>
                <span className="customer-copy-text">{copy}</span>
              </div>
            )}
          </Row>
        </Col>

        {/* STICKER LOGO and DATE and PARCELINFO AND BUSNO AND CASHIER  */}
        <Col span={17} style={{ paddingLeft: ".5rem" }}>
          <Row justify="space-between" className="image-logo-container">
            <img src={getStickerLogoBw()} className="movon-logo" alt="Logo" />
            {transactionDate !== undefined ? (
              <Row justify="center">
                <span className="date-created">
                  {moment(transactionDate).format("MMM DD, YYYY")}
                </span>
              </Row>
            ) : (
              <Row justify="center">
                <span className="date-created">
                  {moment(createdAt).format("MMM DD, YYYY")}
                </span>
              </Row>
            )}
          </Row>
          {parcelInfo.map((e, i) => (
            <TextItem key={i} title={e.title} value={e.value} />
          ))}
        
          {UserProfile.getBusCompanyTag() === "dltb" && (
            <div style={{ textAlign: "right", marginRight: "1rem", display: 'flex', justifyContent: 'space-between' }}>
            <span>BusNo: <strong>{busNumber}</strong></span> <span>Cashier: <strong>{cashier}</strong></span>  
            </div>
          )}
        </Col>
      </Row>
      
      {/* BOTTOM PART OF STICKER - DESTINATION AND BL NUMBER  */}
      {/* if dltb display bottom, destination and bl number */}
      {/* if isarog and scopy, only bottom as well  */}
      {/* if isarog, and if not spcopy, display signature and TC (mcopy and pcopy) */}
      {!Boolean(props.spCopy) &&
      UserProfile.getBusCompanyTag() === "isarog-liner" ? (
        <Row
          style={{
            height: "100%",
            width: "100%",
            borderTop: "1px dashed gray",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: "8px",
              marginTop: "1rem",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "2rem",
              }}
            >
              <div style={{ fontSize: 10, borderTop: "1px solid black" }}>
                I hereby agree with the Terms and
              </div>
              <div style={{ fontSize: 10 }}>
                Conditions of Bicol Isarog TSI.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: "5px",
              }}
            >
              <span
                style={{ textAlign: "center" }}
                className="bottom-destination-text"
              >
                {endStationName}
              </span>
              <span className="bottom-blNo-text">
                BL# <span className="bottom-blNo-num">{billOfLading}</span>
              </span>
            </div>
            <div></div>
          </div>
        </Row>
      ) : (
        <Row
          style={{
            height: "100%",
            borderTop: "1px dashed gray",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", textAlign: "center" }}>
              <span className="bottom-destination-BL-text">
                {endStationName}
              </span>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <span className="bottom-blNo-text">
                BL# <span className="bottom-blNo-num">{billOfLading}</span>
              </span>
            </div>
          </div>
        </Row>
      )}
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
      scanCode,
    } = props.value;

    const parcelInfo = [
      { title: "Sender", value: modifyName(senderName) },
      { title: "Mobile No.", value: senderPhone },
      { title: "Receiver", value: modifyName(recipientName) },
      { title: "Mobile No.", value: recipientPhone },
      { title: "Origin", value: startStationName },
    ];

    let _view = [];
    for (let i = 0; i < 1; i++) {
      _view.push(
        <TicketDetails
          copy="Customer's Copy"
          parcelInfo={parcelInfo}
          key={"p-" + i}
          {...props}
          code={scanCode}
        />
      );
    }
    return _view;
  }
  return null;
};

const MCopy = (props) => {
  let view = undefined;
  switch (UserProfile.getBusCompanyTag()) {
    case "dltb":
    case "isarog-liner":
      if (props) {
        const {
          recipientName,
          recipientPhone,
          senderName,
          senderPhone,
          startStationName,
          noOfSticker,
          scanCode,
        } = props.value;

        const parcelInfo = [
          { title: "Sender", value: modifyName(senderName) },
          { title: "Mobile No.", value: senderPhone },
          { title: "Receiver", value: modifyName(recipientName) },
          { title: "Mobile No.", value: recipientPhone },
          { title: "Origin", value: startStationName },
        ];

        let _view = [];
        for (let i = 0; i < noOfSticker; i++) {
          _view.push(
            <TicketDetails
              copy="Merchant's Copy"
              parcelInfo={parcelInfo}
              key={"p-" + i}
              {...props}
              code={scanCode}
            />
          );
        }
        view = _view;
      }
      break;

    default:
      view = null;
      break;
  }
  return view;
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
          key={"sp-" + i}
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
  console.log("parsed createdParcelResponseData to display in ticket", props);
  return (
    <div className="component-ticketview-container">
      {props.value && <PCopy {...props} />}
      {props.value && <MCopy {...props} />}
      {props.value && <SpCopy {...props} />}
    </div>
  );
};
