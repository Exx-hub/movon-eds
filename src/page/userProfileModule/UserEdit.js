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
  getHeaderLogo,
  getCashierTextColor,
  getHeaderColor
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
import { NavLink } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const initState = {};
const isNull = (value) => value === null || value === undefined || value === "" || value === 0;

const showNotification = (props) => {
  notification[props.type]({
    message: props.title || "Notification Title",
    description: props.message || "message",
  });
};

function UserEditProfileModule(props) {
  const [updateModal, setUpdateModal] = React.useState(false);
  class UserEditProfile extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        staffId: "",
        newStaffId: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
      };
    }

    componentDidMount() {
      const { displayId } = UserProfile.getUser()
      const { password } = UserProfile.getPersonalInfo()
      this.setState({
        staffId: displayId,
        oldPassword: password
      })
    }

    componentDidUpdate(preProps, prevState) { }

    componentWillUnmount() { }

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
        props.history.push(alterPath("/user-profile"));
        return
      }

      openNotificationWithIcon("error", code);
    };

    onValidation = (name) => {
      if ((this.state['staffId'].length < 6)) {
        showNotification({
          title: "Input Fields Validation",
          type: "error",
          message: "Username should not contain spaces.",
        });
        return false;
      }
      if (name === 'password' || name === 'confirmPassword') {
        if (this.state[name].match(/[ ]/)) {
          showNotification({
            title: "Input Fields Validation",
            type: "error",
            message: "No spaces allowed in Password Field",
          })
          return false;
        }
        else if (this.state[name].length < 6) {
          showNotification({
            title: "Input Fields Validation",
            type: "error",
            message: "Username and Password should contain at least 6 characters",
          });
          return false;
        }
        else if (this.state['staffId'].match(/[ ]/)) {
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
      const { firstName, lastName, phoneNumber, newStaffId, staffId } = this.state
      const option = { staffId: newStaffId, firstName, lastName, phoneNumber }
      console.log(option)
      User.updateCredential(option)
        .then(e => {
          const { errorCode } = e.data;
          if (firstName === '' || lastName === '' || phoneNumber === '' || newStaffId === '') {
            showNotification({
              title: "Input Validation",
              type: "error",
              message: "Please fill up missing fields"
            });
          }
          else if (staffId === newStaffId) {
            showNotification({
              title: "Input Validation",
              type: "error",
              message: "Username cannot be the same as old username."
            });
            props.history.push(alterPath("/user-profile/UserEdit"));
          }
          else if (newStaffId.includes(' ')) {
            showNotification({
              title: "Input Validation",
              type: "error",
              message: "Username should not contain spaces."
            });
            props.history.push(alterPath("/user-profile/UserEdit"));
          }
          else {
            props.history.push((setUpdateModal(true)));
            // notification.open({
            //   title: "User Profile Updated!",
            //   type: "success",
            //   message: "You need to re-login your account and continue",
            //   duration: 0,
            //   onClose: () => {
            //     UserProfile.clearData();
            //     props.history.push(alterPath("/"))
            //   }
            // });
          }
        });
      // }

      return;

    }

    render() {
      
      const { firstName,lastName,phone} = UserProfile.getPersonalInfo()
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
            <div className="profile-text">Edit User Profile</div>
            {/* <div className="item-wrapper">
          <span className="title item-wrapper-custom-text-title">
            Full Name
          </span>
          <span className="value item-wrapper-custom-text-value">
            {fullName}
          </span>
        </div> */}

            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">First Name</span>
              <Input value={firstName} type="text" placeholder="" onChange={e => this.setState({ ...this.state, ... { firstName: e.target.value } })} />
            </div>
            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">Last Name</span>
              <Input value={lastName} type="text" placeholder="" onChange={e => this.setState({ ...this.state, ... { lastName: e.target.value } })} />
            </div>

            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">Phone Number</span>
              <Input value={phone.number} type="number" pattern="[0-9]{10}" placeholder="" onChange={e => this.setState({ ...this.state, ...{ phoneNumber: e.target.value } })} />
            </div>

            <div className="item-wrapper">
              <span className="title item-wrapper-custom-text-title">Username</span>
              <Input value={displayId} type="text" placeholder="" onChange={e => this.setState({ newStaffId: e.target.value })} />
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
                onClick={() => {
                  console.log(this.state);
                  this.onUpdateUserProfile()
                }}>
                Update
        </Button>
            </div>
          </div>
          <PromptModal
        visible={updateModal}
        title="Are you sure you want to save your changes?"
        message="Your account will be logged out after saving your changes."
        buttonType="submit"
        action="Update"
        handleCancel={() => setUpdateModal(false)}
        handleOk={() => {
          userProfileObject.logout(User);
          props.history.push(alterPath("/"));
        }}
      />
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
          destination: alterPath("/user-profile/UserEdit"),
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
      <Header className="home-header-view" style={{ background: getHeaderColor() }}>
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
                  <div style={{ color: getCashierTextColor() }}>
                    Hi {userProfileObject.getUser().personalInfo.firstName}!
                <UserOutlined style={{ fontSize: "24px" }} />
                  </div>
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </Header>
      <UserEditProfile />
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

} export default UserEditProfileModule;
