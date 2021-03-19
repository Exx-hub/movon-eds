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

const { Header, Content, Footer } = Layout;

function About(props) {
  const [menuData, setMenuData] = React.useState([]);
  const [visibleLogout, setVisibleLogout] = React.useState(false);
  const [userProfileObject] = React.useState(UserProfile);
  React.useEffect(() => {
    if (menuData.length < 1) {
      setMenuData([
        {
          key: "drop-down-user-profile",
          name: "User Profile",
          type: "menu",
          destination: alterPath("/user-profile"),
          icon: () => <UserOutlined />,
          action: () => { },
        },
        {
          key: "drop-down-setting",
          name: "About",
          type: "menu",
          destination: alterPath("/about"),
          icon: () => <InfoCircleOutlined />,
          action: () => { },
        },
        {
          key: "drop-down-logout",
          name: "Logout",
          type: "menu",
          destination: alterPath("/about"),
          icon: () => <PoweroffOutlined />,
          action: () => {
            setVisibleLogout(true);
          },
        },

        {
          key: "about",
          destination: alterPath("/about"),
          action: () => { },
        },
      ]);
    }
  }, [menuData, userProfileObject]);

  const onNavigationMenuChange = (e) => {
    for (let i = 0; i < menuData.length; i++) {
      if (menuData[i].key === e.key) {
        menuData[i].action();
        props.history.push(menuData[i].destination || alterPath("/"));
        break;
      }
    }
  };

  const menu = () => {
    const menu = menuData.filter((e) => e.type === "menu");
    return (
      <Menu
        onClick={(e) => {
          onNavigationMenuChange(e);
        }}
      >
        {menu.map((e) => {
          const IconMenu = e.icon;
          return (
            <Menu.Item key={e.key}>
              {" "}
              <IconMenu /> {e.name}{" "}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };
  return (
    <Layout className="about-main">
      <Header className="home-header-view" style={{background:getHeaderColor()}}>
        <div>
          <NavLink to="/"><img src={getHeaderLogo()} style={{ height: "120px" }} alt="logo" /></NavLink>
        </div>
        <div>
          {userProfileObject.getUser() && (
            <div className={"header-nav"}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  className={"home-nav-link"}
                  type="link"
                  onClick={(e) => e.preventDefault()}
                >
                  <span style={{color:getCashierTextColor()}}>Hi {userProfileObject.getUser().personalInfo.firstName}!</span>
                  <UserOutlined style={{ fontSize: "24px", color:getCashierTextColor()  }} />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </Header>


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

        <PromptModal
          visible={visibleLogout}
          title="Are you sure you want to log out?"
          message="Changes you made may not be saved."

          buttonType="danger"
          action="Logout"
          handleCancel={() => setVisibleLogout(false)}
          handleOk={() => {
            userProfileObject.logout(User);
            props.history.push(alterPath("/"));
          }}
        />
        <Footer className="footer">

        </Footer>
      </Layout>


    </Layout>
  );
}

export default About;
