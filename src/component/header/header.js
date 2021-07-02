import React from "react";
import {
  getCashierTextColor,
  getHeaderColor,
  getHeaderLogo,
  UserProfile,
} from "../../utility";
import {
  UserOutlined,
  PoweroffOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Menu, Dropdown, Layout } from "antd";
import { NavLink } from "react-router-dom";
const { Header } = Layout;

function _Header(props) {
  console.log("HEADER PROPS:", props);

  //  LEFT DROPDOWN MENU DETAILS HERE -----------------------
  const MenuData = [
    {
      key: "drop-down-user-profile",
      name: "User Profile",
      type: "menu",
      destination: "/user-profile",
      icon: () => <UserOutlined />,
      action: () => props.history.push("/user-profile"),
    },
    {
      key: "drop-down-setting",
      name: "About",
      type: "menu",
      icon: () => <InfoCircleOutlined />,
      // action: () => console.log("clicked about"),
      action: () => props.history.push("/about"),
    },
    {
      key: "drop-down-logout",
      name: "Logout",
      type: "menu",
      destination: "/drop-down-logout",
      icon: () => <PoweroffOutlined />,
      action: () => props.setVisibleLogout(),
    },
  ];

  // MAPPING THROUGH MENUDATA AND DISPLAY MENU ITEM WITH ICON FOR EACH MENUDATA ITEM
  const menu = () => {
    return (
      <Menu onClick={(e) => onNavigationMenuChange(e)}>
        {MenuData.filter((e) => e.type === "menu").map((e) => {
          const IconMenu = e.icon;
          return (
            <Menu.Item key={e.key}>
              <IconMenu /> {e.name}{" "}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  // FUNCTION FOR SWITCHING NAVIGATION FROM DROWDOWN
  const onNavigationMenuChange = (e) => {
    for (let i = 0; i < MenuData.length; i++) {
      if (MenuData[i].key === e.key) {
        MenuData[i].action();
        break;
      }
    }
  };

  return (
    <Header
      className="home-header-view"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        background: getHeaderColor(),
      }}
    >
      <NavLink to="/">
        <img alt="logo" src={getHeaderLogo()} style={{ height: "7vh" }} />
      </NavLink>
      <div>
        {UserProfile.getUser() && (
          <div className={"header-nav"} style={{ color: "black" }}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button
                className={"home-nav-link"}
                type="link"
                onClick={(e) => e.preventDefault()}
              >
                <span style={{ color: getCashierTextColor() }}>
                  Hi {UserProfile.getUser().personalInfo.firstName}!
                </span>
                <UserOutlined
                  style={{ fontSize: "24px", color: getCashierTextColor() }}
                />
              </Button>
            </Dropdown>
          </div>
        )}
      </div>
    </Header>
  );
}

export default _Header;
