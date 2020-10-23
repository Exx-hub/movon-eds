import React from 'react';
import { Form, notification, Input, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { RoundedButton } from '../../component/button'
import movoncargo from '../../assets/movoncargo.png';
import User from '../../service/User';
import { openNotificationWithIcon, alterPath } from '../../utility'
import './login.scss'
import {UserProfile} from '../../utility'

function Login(props) {
  const [state, setState] = React.useState({
    isLoading: false,
    staffId: "",
    password: ""
  });

  React.useEffect(() => {
    if(UserProfile().getCredential()){
      props.history.push(alterPath('/'))
    }
  },[props.history,state]);

  const handleErrorNotification = (code) =>{
    if(!code){
      notification['error']({
        message: "Server Error",
        description: "Something went wrong",
      });
      return;
    }

    if(code === 1000){
      openNotificationWithIcon('error', code, ()=>{
        UserProfile().clearData();
        this.props.history.push(alterPath('/'))
      })
      return;
    }
    openNotificationWithIcon('error', code);
  }

  const onFinish = values => {
    setState({...state, ...{ isLoading: true } });

    User.login(state.staffId, state.password).then(e => {
      console.log('login',e)
      const { data, success, errorCode } = e.data;
      if(errorCode){
        handleErrorNotification(errorCode)
      }
      setState({...state, ...{isLoading:false}})
      if(success){
        UserProfile({ user: data.user, token: data.token});
        if(Number((data.user && data.user.status) || '0') === 0){
          notification['error']({
            message: "Diabled Account",
            description: "Unable to access your account",
          });
          UserProfile.logout(User)
        }
        props.history.push(alterPath('/'))
      }  
    })
  };

  const onFinishFailed = errorInfo => {
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