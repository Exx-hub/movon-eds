import React from "react";
import {
  Form,
  notification,
  Input,
  Row,
  Col,
  Avatar,
  Button,
  Divider,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { RoundedButton } from "../../component/button";
import movon from "../../assets/movon3.png";
import movoncargo from "../../assets/movoncargo.png";
import User from "../../service/User";
import { config } from "../../config";
import {
  getCredential,
  setCredential,
  clearCredential,
  openNotificationWithIcon,
  alterPath,
  UserProfile
} from "../../utility";
import "./changePassword.scss";
import UserProfileHeader from './header'
import TextWrapper from './textWrapper'
const initState = {};



export default class ViewUserProfileModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initState };
  }

  componentDidMount() {}

  componentDidUpdate(preProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const{fullName,phone}=UserProfile.getPersonalInfo()
    const{displayId}=UserProfile.getUser()
    const{name,logo}=UserProfile.getBusCompany()
    const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name 
    
    return (
      <div className="user-profile-module">
        <UserProfileHeader 
          assignedStationName={assignStationName}
          busCompanyName={name}
          logo={logo}
        />

      <div style={{ width: "60%", alignSelf: "center", marginTop: "2rem" }}>
        <TextWrapper title="Full Name" value={fullName}/>
        <TextWrapper title="Phone Number" value={phone.number}/>
        <TextWrapper title="User Name" value={displayId}/>
        <TextWrapper title="Password" value="********"/>
      </div>

      <div
      style={{
        width: "60%",
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "2.5rem",
      }}
    >
      <Button
        style={{ width: "100%", background: "#008080" }}
        type="primary"
        shape="round"
        size="large"
        onClick={()=>this.props.history.push(alterPath('/user-profile/edit'))}>
        Edit
      </Button>
    </div>

    </div>
    );
  }
}


