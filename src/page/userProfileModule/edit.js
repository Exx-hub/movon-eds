import React from "react";
import ReactDOM from "react-dom";
import {
  notification,
  Input,
  Button,
  Dropdown,
  Layout,
  Menu
} from "antd";
import movonLogo from "../../assets/movoncargo.png";
import User from "../../service/User";
import {
  openNotificationWithIcon,
  alterPath,
  UserProfile,
  debounce,
} from "../../utility";
import { PromptModal } from "../../component/modal";
import "./changePassword.scss";
import {
  UserOutlined,
  PoweroffOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import UserProfileHeader from './header'
import TextWrapper from './textWrapper'
const { Header, Content, Footer } = Layout;
const initState = {};
const isNull = (value) => value === null || value === undefined || value === "" || value === 0;

const showNotification = (props) => {
  notification[props.type]({
    message: props.title || "Notification Title",
    description: props.message || "message",
  });
};

function EditUserProfileModule(props){
  class EditUserProfile extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        username: "",
        oldPassword: "",
        password: "",
        confirmPassword: ""
      };
    }

    componentDidMount() {
      const{displayId}=UserProfile.getUser()
      const{password}=UserProfile.getPersonalInfo()
      this.setState({
        username: displayId,
        oldPassword: password
      })
    }

    componentDidUpdate(preProps, prevState) {}

    componentWillUnmount() {}

    handleErrorNotification = (code) => {
      if (isNull(code)) {
        showNotification({
          title: "Server Error",
          type: "error",
          message: "Something went wrong",
        });
        return;
      }
      if (code === "DUPLICATE_STAFF_PASSWORD") {

        openNotificationWithIcon("error", code);
        this.props.history.push(alterPath("/"));
        this.userProfileObject.clearData();
        return;
      }

      if (code === 1000) {
        openNotificationWithIcon("error", code);
        this.props.history.push(alterPath("/"));
        this.userProfileObject.clearData();
        return;
      }

      if (code === 2604) {
        openNotificationWithIcon("error", code);
        this.props.history.push(alterPath("/user-profile"));
        return
      }

      openNotificationWithIcon("error", code);
    };

    onValidation=(name)=>{
      if ((this.state['username'].length < 6)) {
        showNotification({
          title: "Input Fields Validation",
          type: "error",
          message: "Username should not contain spaces.",
        });
        return false;
      }
      if(name === 'password' || name === 'confirmPassword'){
        if(this.state[name].match(/[ ]/)){
          showNotification({
            title: "Input Fields Validation",
            type: "error",
            message: "No spaces allowed in Password Field",
          })
          return false;
        }
        else if(this.state[name].length < 6){
          showNotification({
            title: "Input Fields Validation",
            type: "error",
            message: "Username and Password should contain at least 6 characters",
          });
          return false;
        }
        else if(this.state['username'].match(/[ ]/)){
          showNotification({
            title: "Input Fields Validation",
            type: "error",
            message: "Username should not contain spaces.",
          });
          return false;
        }
        return true;
      }

    }

    onUpdateUserProfile = () => {
      if(this.state.oldPassword && this.state.password && this.state.confirmPassword){

        if(!this.onValidation("password") || !this.onValidation('confirmPassword')){
          return;
        }

        if(this.state.password === this.state.confirmPassword){

          this.setState({ fetching: true }, () => User.updateUserPassword(this.state.username, this.state.oldPassword)
            .then(e => {

              const { error_code } = e.data;
              if (error_code == "DUPLICATE_STAFF_PASSWORD") {

                this.setState({ fetching: true }, () => User.updateUserPassword(this.state.username, this.state.password)
                  .then(e => {
                    const { errorCode } = e.data;
                    const { error_code } = e.data;
                    if (error_code == "DUPLICATE_STAFF_PASSWORD") {
                      openNotificationWithIcon("error", "newpass_confirmpass");
                      props.history.push(alterPath("/user-profile/edit"));

                    } else {
                      if (errorCode) {
                        this.handleErrorNotification(errorCode)
                      }
                      else {
                        notification.open({
                          title: "User Profile Updated!",
                          type: "success",
                          message: "You need to re-login your account and continue",
                          duration: 0,
                          onClose: () => {
                            UserProfile.clearData();
                            props.history.push(alterPath("/"))
                          }
                        });
                      }
                      

                    }
                    

                  }));
                return;
                
              } else {
                openNotificationWithIcon("error", "DUPLICATE_STAFF_PASSWORD");
                props.history.push(alterPath("/user-profile/edit"));
                // this.userProfileObject.clearData();
              }
              // else if (errorCode) {
              //   this.handleErrorNotification(errorCode)
              // } 
              // else {
              //   notification.open({
              //     title: "User Profile Updated!",
              //     type: "success",
              //     message: "You need to re-login your account and continue",
              //     duration: 0,
              //     onClose: () => {
              //       UserProfile.clearData();
              //       props.history.push(alterPath("/"))
              //     }
              //   });
              // }
            }));
        } 
        else {
          showNotification({
            title: "Input Fields Validation",
            type: "error",
            message: "Passwords do not match",
          });
        }
      } else {
        showNotification({
          title: "Input Validation",
          type: "error",
          message: "Please fill up missing fields",
        });
      }
    }

    render() {

      const { fullName } = UserProfile.getPersonalInfo()
      const { name, logo } = UserProfile.getBusCompany()
      const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name

      return (
        <div className="user-profile-module">
          <div className="company-profile">
            <div className="profile-text">Profile</div>
            <UserProfileHeader
              assignedStationName={assignStationName}
              busCompanyName={name}
              logo={logo}
            />
          </div>

          <div className="main-creds">
            <div className="profile-text">User Information</div>
            {/* <div className="item-wrapper">
          <span className="title item-wrapper-custom-text-title">
            Full Name
          </span>
          <span className="value item-wrapper-custom-text-value">
            {fullName}
          </span>
        </div> */}

            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">Current Password</span>
              <Input type="password" placeholder="" onChange={e => this.setState({ ...this.state, ... { oldPassword: e.target.value } })} />
            </div>

            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">New Password</span>
              <Input type="password" placeholder="" onChange={e => this.setState({ ...this.state, ...{ password: e.target.value } })} />
            </div>

            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">Confirm New Password</span>
              <Input type="password" placeholder="" onChange={e => this.setState({ confirmPassword: e.target.value })} />
            </div>
            <div className="button-wrapper-edit">
              <Button className="button-cancel"
                type="primary"
                shape="square"
                size="large"
                onClick={() => props.history.push(alterPath('/user-profile'))}
              >
                Cancel
        </Button>
              <Button className="button-update"
                disabled={this.state.fetching}
                type="primary"
                shape="square"
                size="large"
                onClick={() => this.onUpdateUserProfile()}>
                Update
        </Button>
            </div>
          </div>
        </div>

      );
    }
  }
  const { fullName, phone } = UserProfile.getPersonalInfo()
  const { displayId } = UserProfile.getUser()
  const { name, logo } = UserProfile.getBusCompany()
  const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name
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
          destination: alterPath("/user-profile/edit"),
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
      <Header className="home-header-view">
        <div>
          <a href="home.js"><img src={movonLogo} style={{ height: "50px" }} alt="logo" /></a>
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
      <EditUserProfile />
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
  );
} export default EditUserProfileModule;
