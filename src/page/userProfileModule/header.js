import React from "react";
import {
  Form,
  notification,
  Input,
  Row,
  Col,
  Avatar,
  Button,
  Divider,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { RoundedButton } from "../../component/button";
import movon from "../../assets/movon3.png";
import movoncargo from "../../assets/movoncargo.png";
import User from "../../service/User";
import { config } from "../../config";
import {
  getCredential,
  setCredential,
  clearCredential,
  openNotificationWithIcon,
  UserProfile
} from "../../utility";
import "./changePassword.scss";

function UserProfileHeader(props) {
 
  return (
      <div
        style={{ display: "flex", flexDirection: "row", alignSelf: "center" }}
      >
        <div
          style={{
            alignSelf: "center",
            paddingBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          <div className="avatar-container">
            <img
              alt="avatar-img"
              src={props.logo}
            />
          </div>
        </div>

        <div style={{ width: "80%", alignSelf: "center" }}>
          <div className="item-wrapper">
            <span className="title remove-span-gap">Bus Company</span>
            <span className="value">{props.busCompanyName}</span>
          </div>

          {
          //   <div className="item-wrapper">
          //   <span className="title remove-span-gap">Address</span>
          //   <span className="value"> Cubao Quezon City</span>
          // </div>
          }

          <div className="item-wrapper">
            <span className="title remove-span-gap">Assigned Station</span>
            <span className="value">{props.assignedStationName}</span>
          </div>
        </div>
      </div>
  );
}

export default UserProfileHeader;
