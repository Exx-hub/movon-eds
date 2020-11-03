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
import UserProfileHeader from './header'

function TextWrapper(props){
    return ( <div className="item-wrapper wrapper-margin-top">
    <span className="title item-wrapper-custom-text-title">
      {props.title}
    </span>
    <span className="value item-wrapper-custom-text-value">
      {props.value}
    </span>
  </div>)
}

export default TextWrapper