import React from "react";
import { Link } from 'react-router-dom'
import { Layout, Button } from "antd";
import "./../about/about.scss"
import { openNotificationWithDurationV2, UserProfile } from "../../utility";
import { LogoutModal, CustomModal } from "../../component/modal";
import "./changePassword.scss";
import UserProfileHeader from './header'
import TextWrapper from './textWrapper'
import { Header } from '../../component/header';
import UserEditProfileModule from './UserEdit';


function ViewUserProfileModule(props) {

  const { fullName, phone } = UserProfile.getPersonalInfo()
  const { displayId } = UserProfile.getUser()
  const { displayPassword } = UserProfile.getToken()
  const { name, logo } = UserProfile.getBusCompany()
  const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name
  const [logoutModal, setLogoutModal] =  React.useState({visible:false});
  const [editModal, setEditModal] = React.useState({visible:false})

  const showModal = show =>{
    setEditModal((oldState)=>({...oldState, ...{visible:show}}))
  }

  return (
    <Layout className="about-main">
      <Header {...props} setVisibleLogout={()=>setLogoutModal((oldState)=>({...oldState, ...{visible:true}}))} />
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
          <div className="profile-text">User Profile</div>
          <div className="creds">
            <TextWrapper title="Full Name" value={fullName} />
            <TextWrapper title="Phone Number" value={phone.number} />
          </div>
          <div className="creds">
            <TextWrapper 
              title="User Name" value=
              {<div className="username-edit">
              <div>{displayId}</div>
              <Button type='link' onClick={()=>showModal(true)}>Edit User Profile</Button>
              </div>  
              } />

            <TextWrapper title="Password" value=
              {
                <div className="change-pass">
                  <div>********</div>
                  <div>{displayPassword}</div>
                  <Link to="/user-profile/edit">Change Password</Link>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <LogoutModal {...props} visible={logoutModal.visible} handleCancel={()=>setLogoutModal((oldState)=>({...oldState, ...{visible:false}}))}/>
      <CustomModal
        width={600} 
        closable = {false}
        title="Edit User Profile"
        visible={editModal.visible} 
        onCancel={()=>showModal(false)} >
        <UserEditProfileModule {...props} 
          onCancel={()=>showModal(false)} 
          onOk={(passValidation)=>{
            showModal(false);
            if(passValidation === true){
              openNotificationWithDurationV2('info', "Need to Refresh",  "You need to logout to refresh your credentials", ()=>{
                props.action.clearCredentials()
                props.history.push('/')
              })
            }
          }}
        />
      </CustomModal>        
    </Layout>
  );
}
export default ViewUserProfileModule;