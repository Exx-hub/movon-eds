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
import TextWrapper from './textWrapper'
const initState = {};



export default class ViewUserProfileModule extends React.Component {
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
        <div className="creds">
          <TextWrapper title="Full Name" value="Juan Dela Cruz"/>
          <TextWrapper title="Phone Number" value="Juan Dela Cruz"/>
        </div>
        <div className="creds">
          <TextWrapper title="User Name" value="Juan Dela Cruz"/>
          <TextWrapper title="Password" value="********"/>
        </div>
        <div className="button-wrapper-view">
          <Button className="button-edit"
            type="primary"
            shape="round"
            size="large"
            onClick={()=>this.props.history.push(alterPath('/user-profile/edit'))}>
            Edit
          </Button>
        </div>
      </div>

    </div>
    );
  }
}


