import React from "react";
import "./about.scss";
import logo from "../../assets/movon.png";
import { config } from "../../config";
import User from "../../service/User";
import { Layout, Dropdown, Menu, Button } from "antd";
import movonLogo from "../../assets/movoncargo.png";
import { UserProfile, alterPath, getHeaderLogo, getHeaderColor,getCashierTextColor } from "../../utility";
import { PromptModal } from "../../component/modal";
import { Switch, Route, Redirect, NavLink } from "react-router-dom";
import {
  UserOutlined,
  PoweroffOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { LogoutModal } from "../../component/modal";
import {Header} from '../../component/header'

const {Content, Footer } = Layout;

function About(props) {
  const [menuData, setMenuData] = React.useState([]);
  const [visibleLogout, setVisibleLogout] = React.useState(false);
  const [userProfileObject] = React.useState(UserProfile);
  const [logoutModal, setLogoutModal] =  React.useState({visible:false});

  return (
    <Layout className="about-main">
      <Header {...props} setVisibleLogout={()=>setLogoutModal((oldState)=>({...oldState, ...{visible:true}}))} />
      <Layout>
        <div className="container">
          <div>
            <div className="about-img">
              <img className="img-movon-logo" src={logo} alt="movon-logo" />
              <div className="versionContainer">
                <span className="version text">{config.version.environment} version {config.version.build}</span>
              </div>
            </div>
          </div>
          <div className="about-text">
            <p className="title">About</p>
            <p>
              MOVON EDS MovOn Express Delivery System (EDS) is software technology
              which aims to provide bus companies a more systematic and smarter way of handling their cargo service.
            </p>
            <p>
              EDS offers array of user-friendly delivery system features which enables bus companies to systematize
              their cargo service from the start of the delivery transaction up to its end destination. Monitoring
              of transactions and generation of reports made easier with EDS. It has features which help the key
              decision-makers to have an in-dept analyses of the performance of business. It also features a hierarchy
              of access which allows several restrictions especially for the financial data which guarantees the security
              of the data. One of the key features of EDS for the consumer is the SMS Notification. Messages are being
              sent to both sender and receiver upon departure and arrival of their cargo, allowing them to accurately get
              the delivery status of their cargo - saving their time and effort of waiting in the terminal. MovOn EDS is
              beneficial not just to bus companies but most importantly to customers – to the entire business, making it
              more efficient, making it more profitable.
            </p>
          </div>
        </div>

        <LogoutModal {...props} visible={logoutModal.visible} handleCancel={()=>setLogoutModal((oldState)=>({...oldState, ...{visible:false}}))}/>
        <Footer className="footer">

        </Footer>
      </Layout>


    </Layout>
  );
}

export default About;
