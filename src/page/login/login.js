import React, { useState } from "react";
import { Form, notification, Input, Space, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { RoundedButton } from "../../component/button";
import movoncargo from "../../assets/MovonEds.png";
import User from "../../service/User";
import { openNotificationWithIcon, alterPath } from "../../utility";
import "./login.scss";
import { UserProfile } from "../../utility";
import { config } from "../../config";
import cookie from "../../assets/cookie.png";

function Login(props) {
  const [state, setState] = React.useState({
    isLoading: false,
    staffId: "",
    password: "",
  });
  const [userProfileObject] = React.useState(UserProfile);

  const [cookieVisible, setCookieVisble] = useState(true);

  React.useEffect(() => {
    if (userProfileObject.getCredential()) {
      props.history.push(alterPath("/"));

      // onFinish, userid and pass will be sent to server and if correct credentials, server will return data with the response.
      // user data and token will be saved in localstorate with key "credential". then state will be changed to loading false,
      // that state change will trigger this userEffect, checking if there is value for credential, will change url to "/"
      // window.location.replace("/");
    }
  }, [userProfileObject, props.history, state]);

  const handleErrorNotification = (code) => {
    if (!code) {
      notification["error"]({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }

    if (code === 1000) {
      openNotificationWithIcon("error", code, () => {
        UserProfile.clearData();
        this.props.history.push(alterPath("/"));
      });
      return;
    }
    openNotificationWithIcon("error", code);
  };

  const onFinish = (values) => {
    setState({ ...state, ...{ isLoading: true } });

    User.login(state.staffId, state.password).then((e) => {
      const { data, success, errorCode } = e.data;
      console.log("FRESH FROM LOGIN FETCH:", e.data); // check the response from the server after entering login credentials
      if (errorCode) {
        handleErrorNotification(errorCode);
      }
      setState({ ...state, ...{ isLoading: false } });
      if (success) {
        UserProfile.setCredential({ user: data.user, token: data.token });
        if (Number((data.user && data.user.status) || "0") === 0) {
          notification["error"]({
            message: "Disabled Account",
            description: "Unable to access your account",
          });
          UserProfile.logout(User);
        }
        props.history.push(alterPath("/"));
      }
    });
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className="login-page">
      <div className="login-form">
        <Form name="login" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className="login-page-logo-section">
            <img src={movoncargo} alt="logo" />
          </div>

          <div className="delivery-express-section">
            <span className="txt-delivery-express">
              Express Delivery System
            </span>
          </div>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              style={{ margin: 0 }}
              name="username"
              rules={[{ required: true, message: "Username is required!" }]}
            >
              <Input
                value={state.staffId}
                onChange={(e) =>
                  setState({ ...state, ...{ staffId: e.target.value } })
                }
                placeholder="username"
                disabled={state.isLoading}
                suffix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              style={{ margin: 0 }}
              name="password"
              rules={[{ required: true, message: "Password is required!" }]}
            >
              <Input.Password
                value={state.password}
                onChange={(e) =>
                  setState({ ...state, ...{ password: e.target.value } })
                }
                placeholder="password"
                disabled={state.isLoading}
              />
            </Form.Item>

            <div className="login-button">
              <RoundedButton
                htmlType="submit"
                isSubmit={true}
                disabled={state.isLoading}
                caption="Login"
              />
            </div>
          </Space>
        </Form>

        <div className="version-column">
          <span className="version">
            {config.version.environment} build {config.version.build}
          </span>
        </div>
      </div>

      {/* COOKIE POPUP MODAL  */}
      {/* <Modal
        style={{ position: "absolute", left: "1rem", top: "80vh", flex: 1 }}
        visible={cookieVisible}
        footer={null}
        onCancel={() => setCookieVisble(false)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={{ height: "100px" }} src={cookie} alt="cookie" />
          <p>
            We use cookies to improve your experience and deliver personalized
            content.{" "}
            <Link to="#">
              <b>Customize Settings</b>
            </Link>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Button
            style={{ backgroundColor: "teal", color: "white" }}
            onClick={() => setCookieVisble(false)}
          >
            Accept
          </Button>
        </div>
      </Modal> */}
    </div>
  );
}

export default Login;
