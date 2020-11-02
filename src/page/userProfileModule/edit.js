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
  alterPath,
} from "../../utility";
import "./changePassword.scss";

import UserProfileHeader from './header'

const initState = {};

export default class EditUserProfileModule extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...initState };
  }

  componentDidMount() {}

  componentDidUpdate(preProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="user-profile-module">
        <UserProfileHeader />

      <div className="main-creds">
      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">
          Full Name
        </span>
        <span className="value item-wrapper-custom-text-value">
          Juan Dela Cruz
        </span>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">
          User Name
        </span>
        <Input />
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Password</span>
        <Input type="password" placeholder="password" />
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">
          Confirm Password
        </span>
        <Input type="password" placeholder="confirm password" />
      </div>
      <div className="button-wrapper-edit">
      <Button className="button-cancel"
        type="primary"
        shape="round"
        size="large"
        onClick={()=>this.props.history.push(alterPath('/user-profile'))}
      >
        Cancel
      </Button>
      <Button className="button-update"
        type="primary"
        shape="round"
        size="large"
      >
        Update
      </Button>
    </div>
    </div>
      </div>
    );
  }
}


