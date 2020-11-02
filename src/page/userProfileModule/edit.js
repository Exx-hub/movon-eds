import React from "react";
import {
  notification,
  Input,
  Button,
} from "antd";
import User from "../../service/User";
import {
  openNotificationWithIcon,
  alterPath,
  UserProfile
} from "../../utility";
import "./changePassword.scss";


import UserProfileHeader from './header'

const initState = {};
const isNull = (value) => value === null || value === undefined || value === "";

const showNotification = (props) => {
  notification[props.type]({
    message: props.title || "Notification Title",
    description: props.message || "message",
  });
};

export default class EditUserProfileModule extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      username:"",
      password:"",
      confirmPassword:""
     };
  }

  componentDidMount() {
    const{displayId}=UserProfile.getUser()

    this.setState({
      username:  displayId
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

    if (code === 1000) {
      openNotificationWithIcon("error", code);
      this.userProfileObject.clearData();
      this.props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  render() {

    const{fullName}=UserProfile.getPersonalInfo()
    const{name,logo}=UserProfile.getBusCompany()
    const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name 

    return (
      <div className="user-profile-module">
      <UserProfileHeader 
      assignedStationName={assignStationName}
      busCompanyName={name}
      logo={logo}
    />

      <div className="main-creds">
      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">
          Full Name
        </span>
        <span className="value item-wrapper-custom-text-value">
          {fullName}
        </span>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">
          User Name
        </span>
        <Input value={this.state.username} onChange={e=>this.setState({username:e.target.value})}/>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">Password</span>
        <Input type="password" placeholder="password" onChange={e=>this.setState({password:e.target.value})}/>
      </div>

      <div className="item-wrapper">
        <span className="title item-wrapper-custom-text-title">
          Confirm Password
        </span>
        <Input type="password" placeholder="confirm password" onChange={e=>this.setState({confirmPassword:e.target.value})} />
      </div>
      <div className="button-wrapper-edit">
      <Button className="button-cancel"
        type="primary"
        shape="round"
        size="large"
        onClick={()=>this.props.history.push(alterPath('/user-profile'))}
      >
        Cancel
      </Button>
      <Button className="button-update"
        type="primary"
        shape="round"
        size="large"
        onClick={()=>{
          if(this.state.username && this.state.password && this.state.confirmPassword){

            if(this.state.password === this.state.confirmPassword){
              User.updateUserPassword(this.state.username, this.state.password)
              .then(e=>{
                const{data,erroCode}=e.data;
                console.log('change password',e)
                if(erroCode){
                  this.handleErrorNotification(erroCode)
                }else{
                  UserProfile.clearData();
                  this.props.history.push(alterPath("/"))
                }
              });
            }else{
              showNotification({
                title: "Password MisMatch",
                type: "error",
                message: "Password MisMatch",
              });
            }
          }
          
        }}>
        Update
      </Button>
    </div>
    </div>
      </div>
    );
  }
}


