import React, { useState } from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

function ParcelStatusDropdown() {
  const [parcelStatusVisible, setParceStatusVisible] = useState(false);

  const parcelStatuses = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        marginTop: ".3rem",
      }}
    >
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Created"
        />
        Created
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="In-Transit"
        />
        In-transit
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Received"
        />
        Received
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Claimed"
        />
        Claimed
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Delivered"
        />
        Delivered
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Voided"
        />
        Voided
      </div>
      <div>
        <input
          type="checkbox"
          style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
          name="Modified"
        />
        Modified
      </div>
    </div>
  );

  // PARCEL STATUS VISIBILITY TOGGLER
  const handleVisibleChange = (flag) => {
    setParceStatusVisible(flag);
  };

  return (
    <Dropdown
      onVisibleChange={handleVisibleChange}
      visible={parcelStatusVisible}
      overlay={parcelStatuses}
    >
      <Button>
        Parcel Status <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default ParcelStatusDropdown;
