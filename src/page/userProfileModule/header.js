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
} from "../../utility";
import "./changePassword.scss";

function UserProfileHeader(props) {
  return (
      <div className="main-profile">
        <div className="profile">
          <div className="avatar-container">
            <img
              alt="avatar-img"
              src="https://d2skuhm0vrry40.cloudfront.net/2020/articles/2020-01-13-11-45/pokemon-go-regional-header.jpg/EG11/thumbnail/750x422/format/jpg/quality/60"
            />
          </div>
        </div>

        <div className="bus-profile">
          <div className="item-wrapper">
            <span className="title remove-span-gap">Bus Company</span>
            <span className="value">Bicol Isarog Transport System Inc.</span>
          </div>

          <div className="item-wrapper">
            <span className="title remove-span-gap">Address</span>
            <span className="value"> Cubao Quezon City</span>
          </div>

          <div className="item-wrapper">
            <span className="title remove-span-gap">Assigned Station</span>
            <span className="value">Edsa, Cubao</span>
          </div>
        </div>
      </div>
  );
}

export default UserProfileHeader;
