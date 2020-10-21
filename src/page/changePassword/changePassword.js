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

const initState = {};

export default class UserProfileModule extends React.Component {
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
        <div
          style={{ display: "flex", flexDirection: "row", alignSelf: "center" }}
        >
          <div style={{ alignSelf: "center", paddingBottom: "1rem", marginRight:'1rem' }}>
            <div className="avatar-container">
              <img
                alt="avatar-img"
                src="https://d2skuhm0vrry40.cloudfront.net/2020/articles/2020-01-13-11-45/pokemon-go-regional-header.jpg/EG11/thumbnail/750x422/format/jpg/quality/60"
              />
            </div>
          </div>

          <div style={{ width: "80%", alignSelf: "center" }}>
            <div className="item-wrapper">
              <span className="title remove-span-gap">Bus Company</span>
              <span className="value">Bicol Isarog Transport System Inc.</span>
            </div>

            <div className="item-wrapper">
              <span className="title remove-span-gap">Address</span>
              <span className="value">
                {" "}
                Cubao Quezon City
              </span>
            </div>

            <div className="item-wrapper">
              <span className="title remove-span-gap">Assigned Station</span>
              <span className="value">Edsa, Cubao</span>
            </div>
          </div>
        </div>

        <div style={{ width: "60%", alignSelf: "center", marginTop: "2rem" }}>
          <div className="item-wrapper wrapper-margin-top">
            <span className="title item-wrapper-custom-text-title">
              Full Name
            </span>
            <span className="value item-wrapper-custom-text-value">
              Juan Dela Cruz
            </span>
          </div>

          <div className="item-wrapper wrapper-margin-top">
            <span className="title item-wrapper-custom-text-title">
              User Name
            </span>
            <span className="value item-wrapper-custom-text-value">
              Juan Dela Cruz
            </span>
          </div>

          <div className="item-wrapper wrapper-margin-top">
            <span className="title item-wrapper-custom-text-title">
              Password
            </span>
            <span className="value item-wrapper-custom-text-value">
              Password
            </span>
          </div>

          <div className="item-wrapper wrapper-margin-top">
            <span className="title item-wrapper-custom-text-title">
              Confirm Password
            </span>
            <span className="value item-wrapper-custom-text-value">
              Password
            </span>
          </div>
        </div>

        <div style={{ width: "60%", alignSelf: "center", marginTop: "2.5rem" }}>
          <Button
            style={{ width: "100%", background:'#008080' }}
            type="primary"
            shape="round"
            size="large"
          >
            Update
          </Button>
        </div>
      </div>
    );
  }
}
