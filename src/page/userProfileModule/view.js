import React from "react";
import User from "../../service/User";
import "./../about/about.scss"
import { Layout, Dropdown, Menu, Button } from "antd";
import movonLogo from "../../assets/movoncargo.png";
import { UserProfile, alterPath } from "../../utility";
import { PromptModal } from "../../component/modal";
import {
  UserOutlined,
  PoweroffOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import UserProfileHeader from './header'
import TextWrapper from './textWrapper'
const { Header, Content, Footer } = Layout;

function ViewUserProfileModule(props) {
  const [menuData, setMenuData] = React.useState([]);
  const [visibleLogout, setVisibleLogout] = React.useState(false);
  const [userProfileObject] = React.useState(UserProfile);
  const{fullName,phone}=UserProfile.getPersonalInfo()
  const{displayId}=UserProfile.getUser()
  const{name,logo}=UserProfile.getBusCompany()
  const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name 

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
          destination: alterPath("/user-profile"),
          icon: () => <PoweroffOutlined />,
          action: () => {
            setVisibleLogout(true);
          },
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

  function menu() {
    const menu = menuData.filter((e) => e.type === "menu");
    return (
      <Menu
        onClick={(e) => {
          onNavigationMenuChange(e);
        } }
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
  }
  
  return (
    <Layout className="about-main">

      <Header className="home-header-view">
        <div>
          <a href={alterPath("/search-parcel")}><img src={movonLogo} style={{ height: "50px" }} alt="logo" /></a>
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
                  Hi {userProfileObject.getUser().personalInfo.firstName}!
                  <UserOutlined style={{ fontSize: "24px" }} />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </Header>
      <div className="user-profile-module">
        <UserProfileHeader
          assignedStationName={assignStationName}
          busCompanyName={name}
          logo={logo}
        />

      <div className="main-creds">
        <div className="creds">
          <TextWrapper title="Full Name" value={fullName}/>
          <TextWrapper title="Phone Number" value={phone.number}/>
        </div>
        <div className="creds">
          <TextWrapper title="User Name" value={displayId}/>
          <TextWrapper title="Password" value="********"/>
        </div>
        <div className="button-wrapper-view">
          <Button className="button-edit"
            type="primary"
            shape="round"
            size="large"
            onClick={()=>props.history.push(alterPath('/user-profile/edit'))}>
            Edit
          </Button>
        </div>
      </div>

    </div>
      <Layout>
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
      </Layout>
    </Layout>
  );
}

export default ViewUserProfileModule;