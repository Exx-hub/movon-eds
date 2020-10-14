import React from 'react';
import Manifest from '../manifest';
import Reports from '../reports';
import User from '../../service/User';
import movonLogo from '../../assets/movoncargo.png';
import {clearCredential,getCredential, UserProfile, alterPath} from '../../utility'
import { PriceMatrix, VictoryLinerMatrix } from '../priceMatrix'
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
    title: 'BL NO.',
    dataIndex: 'billOfLading',
    key: 'billOfLading',
  },
  {
    title: 'SENDER',
    dataIndex: 'sender',
    key: 'sender,'
  },
  {
    title: 'SENDER PHONE#.',
    dataIndex: 'senderPhoneNo',
    key: 'senderPhoneNo,'
  },
  {
    title: 'RECEIVER',
    dataIndex: 'recipient',
    key: 'recipient,'
  },
  {
    title: 'RECEIVER PHONE#',
    dataIndex: 'recipientPhoneNo',
    key: 'recipientPhoneNo,'
  },
  {
    title: 'DESTINATION',
    dataIndex: 'destination',
    key: 'destination,'
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
    title: 'DESCRIPTION',
    dataIndex: 'packageName',
    key: 'packageName',
  },
  {
    title: 'REMARKS',
    dataIndex: 'remarks',
    key: 'remarks',
  },
  {
    title: 'AMOUNT',
    dataIndex: 'price',
    key: 'price',
  }
];


function Home(props) {

  const [state, setState] = React.useState({});
  //const userProfileObject = new UserProfile()
  const [menuData,setMenuData] = React.useState([])
  const [userProfileObject,setUserProfileObject] = React.useState(new UserProfile())

  React.useEffect(() => {

    if(!setUserProfileObject){
      setUserProfileObject(new UserProfile());
    }

    if(!state.user){
      const{user} = getCredential();
      setState({...state, ...{user}})
    }
    if(menuData.length < 1){
      setMenuData([
        {key:"create-parcel", destination: alterPath("/create-parcel"), action:()=>{}},
        {key:"search-parcel", destination: alterPath("/search-parcel"), action:()=>{}},
        {key:"manifest-report", destination: alterPath("/manifest/list"), action:()=>{}},
        {key:"matrix-own", destination: alterPath("/matrix/own"), action:()=>{}},
        {key:"matrix-vli", destination: alterPath("/matrix/victory-liners"), action:()=>{}},
        {key:"sales-vli-bitsi", destination: alterPath("/report/sales/vli-bitsi"), action:()=>{}},
        {key:"sales-cargo", destination: alterPath("/report/sales/cargo"), action:()=>{}},
        {key:"drop-down-setting",  name:'Setting', type:'menu', destination: alterPath("/drop-down-setting"), icon:()=><SettingOutlined/>, action:()=>userProfileObject.logout(User)},
        {key:"drop-down-logout", name:'Logout', type:'menu', destination: alterPath("/drop-down-logout"), icon:()=><PoweroffOutlined/>, action:()=>{}},
      ])
    }
  },[state,menuData,userProfileObject]);

  const onNavigationMenuChange = (e) =>{
    for(let i=0; i<menuData.length; i++){
      if(menuData[i].key === e.key){
        menuData[i].action();
        props.history.push(menuData[i].destination || alterPath('/'))
        break;
      }
    }
  }

  const menu = ()=> {
    const menu  = menuData.filter(e=>e.type === 'menu');
    console.log('menu',menu)
    return (
      <Menu onClick={(e)=>{ onNavigationMenuChange(e) }}>
      {
        menu.map(e=>{
          const IconMenu = e.icon;
          return <Menu.Item key="drop-down-setting"> <IconMenu/> {e.name} </Menu.Item>
        })
      }
        <Menu.Item key="drop-down-setting">
          <SettingOutlined /> Setting
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="drop-down-logout">
          <PoweroffOutlined /> Logout
        </Menu.Item>
      </Menu>
    );
  }

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

            <Menu.Item key="manifest-report" icon={<BarChartOutlined />}>Manifest</Menu.Item>
            
            <SubMenu key="sales-report" icon={<BarChartOutlined />} title="Reports">
              <Menu.Item key="sales-cargo" icon={<BarChartOutlined />}>Cargo Sales</Menu.Item>
            { userProfileObject.isIsarogLiners() && <Menu.Item key="sales-vli-bitsi" icon={<BarChartOutlined />}>VLI - BITSI Sales</Menu.Item>}
            </SubMenu>

            <SubMenu key="matrix" icon={<FileSearchOutlined />} title="Matrix">
              <Menu.Item key="matrix-own" icon={<AppstoreAddOutlined />}>{userProfileObject.getBusCompany().name}</Menu.Item>
              <Menu.Item key="matrix-vli" icon={<SearchOutlined />}>Victory Liners</Menu.Item>
            </SubMenu>

          </Menu>
        </Sider>
        <Layout >
          <Content className={'home-content'}>

            <Switch>
              <Route path={alterPath('/matrix/own')}>
                <PriceMatrix {...props}/>
              </Route>

              <Route path={alterPath('/matrix/victory-liners')}>
                <VictoryLinerMatrix {...props}/>
              </Route>

              <Route path={alterPath('/manifest/list')}>
                <Manifest {...props}/>
              </Route>

              <Route path={alterPath('/reports"')}>
                <Reports {...props}/>
              </Route>

              <Route path={alterPath('/search-parcel')}>
                <SearchModule {...props}/>
              </Route>

              <Route path={alterPath('/report/sales/cargo')}>
                <SalesReport 
                  source={tableSourceBitsi}
                  {...props} 
                  title="SUMMARY OF CARGO SALES"/>
              </Route>

              <Route path={alterPath('/report/sales/vli-bitsi')}>
                <SalesReport 
                  source={tableSourceVliBitsi}
                  isP2P={true}
                  {...props} 
                  title="SUMMARY OF VLI-BITSI SALES"/>
              </Route>

              <Redirect from="/" to={ alterPath('/search-parcel')} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
export default Home;
