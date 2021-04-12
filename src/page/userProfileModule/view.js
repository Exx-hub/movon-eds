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
import EditPassword from './edit';


function ViewUserProfileModule(props) {

  const { fullName, phone } = UserProfile.getPersonalInfo()
  const { displayId } = UserProfile.getUser()
  const { displayPassword } = UserProfile.getToken()
  const { name, logo } = UserProfile.getBusCompany()
  const assignStationName = UserProfile.getAssignedStation() && UserProfile.getAssignedStation().name
  const TYPE= {edit_password:2, edit_profile:1, none:0}

  const [logoutModal, setLogoutModal] =  React.useState({visible:false, type:TYPE.none, title:"NONE"});
  const [editModal, setEditModal] = React.useState({visible:false})
  const [editPassword, setEditPassword] = React.useState(false)
  const [editProfile, setEditProfile] = React.useState(false)

  const showModal = (show, type, title) =>{
    setEditModal((oldState)=>({...oldState, ...{visible:show, type, title}}))
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
              <Button type='link' onClick={()=>showModal(true,TYPE.edit_profile, "Edit User Profile")}>Edit User Profile</Button>
              </div>  
              } />

            <TextWrapper title="Password" value=
              {
                <div className="change-pass">
                  <div>********</div>
                  <div>{displayPassword}</div>
                  <Button type='link' onClick={()=>showModal(true, TYPE.edit_password, "Edit Password")}>Edit User Profile</Button>
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
        title={editModal.title}
        visible={editModal.visible} 
        onCancel={()=>showModal(false, TYPE.none)} >
          {
            editModal.type === TYPE.edit_profile  && <UserEditProfileModule {...props} 
            onCancel={()=>showModal(false, TYPE.none)} 
            onOk={(passValidation)=>{
              showModal(false, TYPE.none);
              if(passValidation === true){
                openNotificationWithDurationV2('info', "Need to Refresh",  "You need to logout to refresh your credentials", ()=>{
                  props.action.clearCredentials()
                  props.history.push('/')
                })
              }
              }}
            />
          }

          {
            editModal.type === TYPE.edit_password && <EditPassword {...props} 
            onCancel={()=>showModal(false, TYPE.none)} 
            onOk={(passValidation)=>{
              showModal(false, TYPE.none);
              if(passValidation === true){
                openNotificationWithDurationV2('info', "Need to Refresh",  "You need to logout to refresh your credentials", ()=>{
                  props.action.clearCredentials()
                  props.history.push('/')
                })
              }
              }}
            />
          }
        
      </CustomModal>        
    </Layout>
  );
}
export default ViewUserProfileModule;