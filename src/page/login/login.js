import React from 'react';
import { Form, notification, Input, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { RoundedButton } from '../../component/button'
import movon from '../../assets/movon3.png';
import movoncargo from '../../assets/movoncargo.png';
import User from '../../service/User';
import { config } from '../../config';
import { getCredential, setCredential } from '../../utility'
import './login.scss'

function Login(props) {
  const [state, setState] = React.useState({
    isLoading: false,
    staffId: "",
    password: ""
  });

  React.useEffect(() => {
    if(getCredential()){
      props.history.push('/')
    }
  },[]);

  /**
    @param {string} type - success, info, warning, error
    @param {number} code - 000
  */
  const openNotificationWithIcon = (type, code) => {
    notification[type]({
      message: config[code].message || "Login Failed",
      description: config[code].description || "username or password isn't correct",
    });
  };

  const onFinish = values => {
    setState({...state, ...{ isLoading: true } });

    User.login(state.staffId, state.password).then(e => {
      const { data, success, errorCode } = e.data;
      setState({...state, ...{isLoading:false}})
      if(success){
        setCredential({ user: data.user, token: data.token});
        props.history.push('/')
        return;
      }
      openNotificationWithIcon("error", errorCode)
    })
  };

  const onFinishFailed = errorInfo => {
    //console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page">

      <div className="login-form">
        <Form
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>

          <div className="login-page-logo-section">
            <img src={movoncargo} alt="logo"/>
          </div>
          <div className="delivery-express-section">
            <span className="txt-delivery-express">Express Delivery | Web Portal</span>
          </div>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              style={{margin:0}}
              name="username"
              rules={[{ required: true, message: 'Username is required!' }]}>
              <Input
                value={state.staffId}
                onChange={(e) => setState({ ...state, ...{ staffId: e.target.value } })}
                placeholder="username"
                disabled={state.isLoading}
                suffix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              style={{margin:0}}
              name="password"
              rules={[{ required: true, message: 'Password is required!' }]}>
              <Input.Password
                value={state.password}
                onChange={(e) => setState({ ...state, ...{ password: e.target.value } })}
                placeholder="password"
                disabled={state.isLoading} />
            </Form.Item>

            <div className="login-button">
              <RoundedButton
                htmlType="submit"
                isSubmit={true}
                disabled={state.isLoading}
                caption="Login" />
            </div>
          </Space>
        </Form>
      </div>
    </div>
  );
}

export default Login;