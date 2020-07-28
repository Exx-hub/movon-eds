import React from 'react';
import Manifest from '../manifest';
import User from '../../service/User';
import movonLogo from '../../assets/movoncargo.png';
import {clearCredential,getCredential} from '../../utility'
import PriceMatrix from '../priceMatrix'

import './home.scss';

import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { 
  Layout, 
  Row, 
  Col , 
  Button, 
  Menu, 
  Dropdown
} from 'antd';

import {
  AuditOutlined,
  UserOutlined,
  PoweroffOutlined,
  SettingOutlined,
  FileSearchOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

function Home(props) {

  const [state, setState] = React.useState({});

  React.useEffect(() => {
    if(!state.user){
      const{user} = getCredential();
      setState({...state, ...{user}})
    }
  },[state.user]);

  const onNavigationMenuChange = (e) =>{
    switch(e.key){
      case '2': props.history.push("/parcel"); break
      case '3': props.history.push("/manifest/list"); break
      case '4': props.history.push("/manifest/matrix"); break
      case 'drop-down-logout' : 
        const{ token }=getCredential();
        User.logout(token).then();
        clearCredential();
        props.history.push('/');
        
        break;
      case 'drop-down-setting' : 
        console.log('onNavigationMenuChange e',e); 
        break;
      default: break;
    }
  }

  const menu = (
    <Menu onClick={(e)=>{ onNavigationMenuChange(e) }}>
      <Menu.Item key="drop-down-setting">
        <SettingOutlined /> Setting
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="drop-down-logout">
        <PoweroffOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="home-page-container">
      <Header className="home-header-view">
        <Row>
          <Col span={12} style={{position:'relative'}}>
            <img src={movonLogo} style={{height:'50px'}} alt="logo"/>  
          </Col>
          {
            state.user && <Col span={12}>
              <div className={'header-nav'}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className={'home-nav-link'} type="link" onClick={e => e.preventDefault()}>
                    Hi {state.user.personalInfo.firstName}!  
                    <UserOutlined style={{fontSize:'24px'}}/>
                  </Button>
                </Dropdown>
              </div>
            </Col>
          }
        </Row>
      </Header>
      <Layout style={{background:'yellow'}}>
        <Sider width={200} className="home-sider">
          <Menu 
          style={{marginTop:'1rem'}}
          theme="light" 
          defaultSelectedKeys={['1']} 
          mode="inline" 
          onClick={(e)=>{ onNavigationMenuChange(e) }}>
            {/* <Menu.Item key="1" icon={<BarChartOutlined />}>
              Dashboard
            </Menu.Item> */}
            <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
              Add Parcel
            </Menu.Item>
            <Menu.Item key="3" icon={<AuditOutlined />}>
              Manifest
            </Menu.Item>
            <Menu.Item key="4" icon={<FileSearchOutlined />}>
              Matrix
            </Menu.Item>
            {/* <Menu.Item key="5" icon={<TrophyOutlined />}>
             Claim
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout >
          <Content className={'home-content'}>
            <Switch>
              <Route path="/manifest/matrix">
                <PriceMatrix {...props}/>
              </Route>
              <Route path="/manifest/list">
                <Manifest {...props}/>
              </Route>
              <Redirect from="/" to="/manifest/list" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
      
    </Layout>
  );
}

export default Home;
