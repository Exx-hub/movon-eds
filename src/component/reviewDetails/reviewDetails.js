import React from "react";
import "./reviewdetails.scss";
import defaultImage from "../../assets/movoncargo.png";
import { UserProfile } from "../../utility";
import { getManifestPreviewHeader } from "../../utility";

export function ReviewDetails(props) {
  console.log("REVIEW DETAILS PROPS:",props)
  return (
    <div className="preview-details">
      <Container title="Package Information">
        <div className="horizontal-layout">
          <PackageInformationSection
            {...props}
            className="horizontal-layout"
            style={{ width: "60%", marginLeft: "2rem" }}
          />
          <div
            className="horizontal-layout image-section"
            style={{ width: "40%" }}
          >
            <img
              className="parcel-image"
              src={props.value.packageImages[0] || defaultImage}
              alt="parcel"
            />
          </div>
        </div>
      </Container>

      <Container title="Price Details">
        <div className="horizontal-layout">
          <FeeSection
            {...props}
            className="horizontal-layout"
            style={{ width: "100%", marginLeft: "2rem" }}
          />
        </div>
      </Container>
    </div>
  );
}

function PackageInformationSection(props) {
  const data = props.value;
  const destination = data.startStationName
    ? data.startStationName
    : data.destination;
  const billOfLading = data.billOfLading || "";
  const type = data.type || "preview";

  return (
    <div className="vertical-layout" style={{ ...props.style }}>
      <div className="text-list-container" style={{ padding: "2rem" }}>
        <TextContainer label="Destination" value={destination} />
        <TextContainer
          label="Description"
          value={props.value.packageName || ""}
        />
        {type === "create" &&
          UserProfile.getBusCompanyTag() !== "isarog-liner" && (
            <TextContainer label="Bill of Lading" value={billOfLading} />
          )}
        {type === "preview" && (
          <TextContainer label="Bill of Lading" value={billOfLading} />
        )}

        <br />
        <TextContainer
          label="Sender Name"
          value={props.value.senderName || "senderName"}
        />
        <TextContainer
          label="Sender Phone No"
          value={props.value.senderPhone || "senderPhone"}
        />
        {props.value.senderEmail && (
          <TextContainer
            label="Sender Email"
            value={props.value.senderEmail || ""}
          />
        )}
        <br />
        <TextContainer
          label="Receiver Name"
          value={props.value.recipientName || "recipientName"}
        />
        <TextContainer
          label="Receiver Phone No"
          value={props.value.recipientPhone || "recipientPhone"}
        />
        {props.value.recipientEmail && (
          <TextContainer
            label="Receiver Email"
            value={props.value.recipientEmail || ""}
          />
        )}
        <br />
        <TextContainer
          label="Cashier"
          value={props.value.cashier || "no assigned cashier"}
        />

        {UserProfile.getAssignedStationName().includes("Ambulant") && 
        <TextContainer
          label="Transaction Date"
          value={props.value.ambulantDate || ""}
        />
        }
        
      </div>
    </div>
  );
}

function FeeSection(props) {
  let inputSection = undefined;
  let feesSection = undefined;

  const data = props.value;
  const length = (data.length || 0) + " m";
  const weight = (data.packageWeight || 0) + " kg";
  const stickerCount =
    (data.subParcels ? data.subParcels.length : data.stickerCount) || 0;
  const packageQty = data.packageQty || 0;

  const convenienceFee = "₱ " + Number(data.convenienceFee || "0").toFixed(2);
  const declaredValue = "₱ " + Number(data.declaredValue || "0").toFixed(2);
  const totalPrice = "₱ " + Number(data.totalPrice || "0").toFixed(2);

  const portersFee = "₱ " + Number(data.portersFee || "0").toFixed(2);
  const declaredValueFee =
    "₱ " + Number(data.declaredValueFee || "0").toFixed(2);
  const discountFee = "- ₱ " + Number(data.discountFee || "0").toFixed(2);
  const handlingFee = " ₱ " + Number(data.handlingFee || "0").toFixed(2);
  const additionalFee = " ₱ " + Number(data.additionalFee || "0").toFixed(2);
  const insuranceFee = " ₱ " + Number(data.insuranceFee || "0").toFixed(2);
  const weightFee = " ₱ " + Number(data.weightFee || "0").toFixed(2);
  const lengthFee = " ₱ " + Number(data.lengthFee || "0").toFixed(2);
  const basePrice = " ₱ " + Number(data.basePrice || "0").toFixed(2);

  switch (UserProfile.getBusCompanyTag()) {
    case "dltb":
      feesSection = (
        <>
          <NumberContainer label="Additional Fee" value={additionalFee} />
          {/* <NumberContainer label="Weight Fee" value={weightFee} /> */}
          <NumberContainer label="Handling Fee" value={handlingFee} />
          <NumberContainer label="Insurance Fee" value={insuranceFee} />
          <NumberContainer
            label="Declared Value Fee"
            value={declaredValueFee}
          />
        </>
      );
      break;

    case "tst":
      feesSection = (
        <>
          <NumberContainer label="Additional Fee" value={additionalFee} />
          <NumberContainer label="Handling Fee" value={handlingFee} />
          <NumberContainer label="Insurance Fee" value={insuranceFee} />
          <NumberContainer
            label="Declared Value Fee"
            value={declaredValueFee}
          />
        </>
      );
      break;

    case "five-star":
      inputSection = <TextContainer label="Length" value={length} />;
      feesSection = (
        <>
          <NumberContainer label="Length Fee" value={lengthFee} />
          <NumberContainer label="Weight Fee" value={weightFee} />
          <NumberContainer
            label="Declared Value Fee"
            value={declaredValueFee}
          />
          <NumberContainer label="Discount" value={discountFee} />
        </>
      );
      break;

    default:
      inputSection = <TextContainer label="Length" value={length} />;
      feesSection = (
        <>
          <NumberContainer label="Additional Fee" value={additionalFee} />
          <NumberContainer label="Porter's Fee" value={portersFee} />
          <NumberContainer label="Length Fee" value={lengthFee} />
          <NumberContainer label="Insurance Fee" value={declaredValueFee} />
          <NumberContainer label="Discount" value={discountFee} />
        </>
      );
      break;
  }

  return (
    <div className="feeSection" style={{ ...props.style }}>
      <div className="horizontal-layout">
        <div className="feeSection-left">
          <TextContainer label="Declared Value" value={declaredValue} />
          <TextContainer label="Package Count" value={stickerCount} />
          <TextContainer label="Weight Fee" value={weightFee} />
          <TextContainer label="Quantity" value={packageQty} />
          <TextContainer label="Weight" value={weight} />
          {inputSection}
        </div>

        <div className="feeSection-right">
          <p className="paymentBreakdownText">Payment Breakdown</p>
          <NumberContainer label="Base Price" value={basePrice} />
          <NumberContainer label="Weight Fee" value={weightFee} />
          {feesSection}
          <NumberContainer label="System Fee" value={convenienceFee} />
          <NumberContainer label="Total Shipping Cost" value={totalPrice} />
        </div>
      </div>
    </div>
  );
}

function TextContainer(props) {
  return (
    <div className="text-section">
      <div className="label">
        <label>{props.label}</label>
      </div>
      :
      <div className="label-value" style={{ fontWeight: "bold" }}>
        <label>{props.value}</label>
      </div>
    </div>
  );
}

function NumberContainer(props) {
  return (
    <div
      className="number-section"
      style={{ borderBottom: "1px solid rgba(56,546,56,0.3)" }}
    >
      <div className="label">
        <label>{props.label}</label>
      </div>
      <div className="label-value" style={{ fontWeight: "bold" }}>
        <label>{props.value}</label>
      </div>
    </div>
  );
}

function Container(props) {
  return (
    <div className="box-container">
      <div
        className="box-title"
        style={{ background: getManifestPreviewHeader() }}
      >
        {props.title}
      </div>

      <div className="box-body">{props.children}</div>
    </div>
  );
}

export default ReviewDetails;
