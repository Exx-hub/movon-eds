import React from 'react';
import { Form, notification, Input, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { RoundedButton } from '../../component/button'
import './login.scss'
import movon from '../../assets/movon3.png';
import User from '../../service/User';
import { config } from '../../config';
import { getCredential, setCredential } from '../../utility'

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
      message: config[code].message,
      description: config[code].description,
    });
  };

  const onFinish = values => {
    setState({...state, ...{ isLoading: true } });

    User.login(state.staffId, state.password).then(e => {
      console.log('===>e', e)
      const { data, success, errorCode } = e.data;
      if(!success && errorCode){
        openNotificationWithIcon("error", errorCode)
      }else{ 
        setCredential({ user: data.user, token: data.token});
        props.history.push('/')
      }
      setState({...state,...{isLoading:false}})
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page">

      <div className="login-form">
        <Form
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>

          <div className="login-page-logo-section">
            <img src={movon} />
          </div>
          <div className="delivery-express-section">
            <span className="txt-delivery-express">Delivery Express</span>
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