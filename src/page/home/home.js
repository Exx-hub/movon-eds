import React from 'react';
import Manifest from '../manifest';
import Reports from '../reports';
import User from '../../service/User';
import movonLogo from '../../assets/movoncargo.png';
import {clearCredential,getCredential, UserProfile} from '../../utility'
import PriceMatrix from '../priceMatrix'
import SalesReport from "../salesReport"
import SearchModule from '../searchModule'

import moment from 'moment'

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
  AppstoreAddOutlined,
  BarChartOutlined,
  SearchOutlined,
  InboxOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const tableSourceVliBitsi = [
  {
    title: 'DATE',
    dataIndex: 'sentDate',
    key: 'sentDate',
    render: text => moment(text).format('MMM DD, YYYY')
  },
  {
    title: 'DESTINATION',
    dataIndex: 'destination',
    key: 'destination,'
  },
  {
    title: 'SENDER',
    dataIndex: 'sender',
    key: 'sender,'
  },
  {
    title: 'RECEIVER',
    dataIndex: 'recipient',
    key: 'recipient,'
  },
  {
    title: 'WEIGHT',
    dataIndex: 'packageWeight',
    key: 'packageWeight',
  },
  {
    title: 'DECLARED VALUE',
    dataIndex: 'declaredValue',
    key: 'declaredValue',
  },
  {
    title: 'BL NO.',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'OR NO.',
    dataIndex: 'associatedORNumber',
    key: 'associatedORNumber',
  },
  {
    title: 'TARIFF',
    dataIndex: 'associatedTariffRate',
    key: 'associatedTariffRate',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'packageName',
    key: 'packageName',
  },
  {
    title: 'AMOUNT',
    dataIndex: 'price',
    key: 'price',
  }
];
const tableSourceBitsi = [
  {
    title: 'DATE',
    dataIndex: 'sentDate',
    key: 'sentDate',
    render: text => moment(text).format('MMM DD, YYYY')
  },
  {
    title: 'DESTINATION',
    dataIndex: 'destination',
    key: 'destination,'
  },
  {
    title: 'SENDER',
    dataIndex: 'sender',
    key: 'sender,'
  },
  {
    title: 'RECEIVER',
    dataIndex: 'recipient',
    key: 'recipient,'
  },
  {
    title: 'WEIGHT',
    dataIndex: 'packageWeight',
    key: 'packageWeight',
  },
  {
    title: 'DECLARED VALUE',
    dataIndex: 'declaredValue',
    key: 'declaredValue',
  },
  {
    title: 'BL NO.',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'packageName',
    key: 'packageName',
  },
  {
    title: 'AMOUNT',
    dataIndex: 'price',
    key: 'price',
  }
];

function Home(props) {

  const [state, setState] = React.useState({});
  const UserProfileObject = new UserProfile()

  React.useEffect(() => {
    if(!state.user){
      const{user} = getCredential();
      setState({...state, ...{user}})
    }
  },[state]);

  const onNavigationMenuChange = (e) =>{
    switch(e.key){
      case 'create-parcel': props.history.push("/parcel"); break
      case 'search-parcel': props.history.push("/search-parcel"); break
      case 'manifest-report': props.history.push("/manifest/list"); break
      case '4': props.history.push("/manifest/matrix"); break
      case '6': props.history.push("/report/sales/vli-bitsi"); break
      case '5': props.history.push("/report/sales/cargo"); break
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
        <Sider width={250} className="home-sider">
          <Menu 
          style={{marginTop:'1rem'}}
          theme="light" 
          defaultSelectedKeys={['1']} 
          defaultOpenKeys={['parcel']}
          mode="inline" 
          onClick={(e)=>{ onNavigationMenuChange(e) }}>
            <SubMenu key="parcel" icon={<InboxOutlined />} title="Parcel">
              <Menu.Item key="create-parcel" icon={<AppstoreAddOutlined />}>Create</Menu.Item>
              <Menu.Item key="search-parcel" icon={<SearchOutlined />}>Search</Menu.Item>
            </SubMenu>

            <div style={{display:'none'}}>
              <Menu.Item key="2" icon={<AppstoreAddOutlined />}> Add Parcel </Menu.Item>
              <Menu.Item key="3" icon={<AuditOutlined />}> Manifest </Menu.Item>
            </div>

            <Menu.Item key="4" icon={<FileSearchOutlined />}> Matrix </Menu.Item>
            <Menu.Item key="manifest-report" icon={<BarChartOutlined />}>Manifest</Menu.Item>
            
            <SubMenu key="sub1" icon={<BarChartOutlined />} title="Reports">
              <Menu.Item key="5" icon={<BarChartOutlined />}>Cargo Sales</Menu.Item>
            { UserProfileObject.isIsarogLiners() && <Menu.Item key="6" icon={<BarChartOutlined />}>VLI - BITSI Sales</Menu.Item>}
            </SubMenu>

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

              <Route path="/reports">
                <Reports {...props}/>
              </Route>

              <Route path="/search-parcel">
                <SearchModule {...props}/>
              </Route>

              <Route path="/report/sales/cargo">
                <SalesReport 
                  source={tableSourceBitsi}
                  {...props} 
                  title="SUMMARY OF CARGO SALES"/>
              </Route>

              <Route path="/report/sales/vli-bitsi">
                <SalesReport 
                  source={tableSourceVliBitsi}
                  isP2P={true}
                  {...props} 
                  title="SUMMARY OF VLI-BITSI SALES"/>
              </Route>

              <Redirect from="/" to="/search-parcel" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
export default Home;
