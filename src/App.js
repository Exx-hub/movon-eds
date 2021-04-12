import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './page/login'
import CreateParcel from './page/createParcel'
import ManifestDetails from './page/manifestDetails'
import About from './page/about'
import PrinManifestDetails from './page/prinManifestDetails'
import {alterPath, UserProfile, openNotificationWithIcon} from './utility'
import Home from './page/home'
import 'antd/dist/antd.css';
import './App.scss';
import { EditUserProfileModule, ViewUserProfileModule, UserEditProfileModule } from './page/userProfileModule';
import { notification} from "antd";
import User from "./service/User";


function App(props) {
  const [internetConnection, setInternetConnection] = React.useState(false)
  window.addEventListener('online', () => setInternetConnection(true));
  window.addEventListener('offline', () => setInternetConnection(false));

  React.useEffect(()=>{
    setInternetConnection(navigator.onLine)
  },[])

  const handleErrorNotification = (code) => {
    if (!code) {
      notification.error({
        message: "Server Error",
        description: "Something went wrong"
      });
      return;
    }

    if (code === 1000) {
      openNotificationWithIcon("error", code);
      this.userProfileObject.clearData();
      props.history.push(alterPath("/"));
      return;
    }
    openNotificationWithIcon("error", code);
  };

  const clearCredentials = (props) =>{
    UserProfile.logout(User);
    //props.history.push("/");
  }

  const ProtectedRoute = (params) => {
    return UserProfile.getCredential() ? (<Route {...params} render={()=><params.component/>} />) : (<Redirect to={alterPath("/login")} />)
  }

  const action ={
    clearCredentials,
    handleErrorNotification
  }
  
  return (
    <>
    {!internetConnection && <div className="no-internet-connection"/>}
    <Router>
      <Switch>
      <Route exact={true} path={alterPath("/login")} render={props=> <Login {...props} />} />
      <ProtectedRoute exact={true} path={alterPath("/user-profile/edit")} component={(props)=><EditUserProfileModule {...props}/>}/>
      <ProtectedRoute exact={true} path={alterPath("/user-profile/userEdit")} component={(props)=><UserEditProfileModule {...props} action={action}/>}/>
      <ProtectedRoute exact={true} path={alterPath("/user-profile")} component={props => <ViewUserProfileModule {...props} action={action} />}/>
      <ProtectedRoute exact={true} path={alterPath("/about")} component={props => <About {...props} />}/>
      <ProtectedRoute exact={true} path={alterPath("/manifest/details")} component={props => <ManifestDetails {...props}/>}/>
      <ProtectedRoute exact={true} path={alterPath("/manifest/print/")} component={ props => <PrinManifestDetails {...props} />} />
      <ProtectedRoute exact={true} path={alterPath("/create-parcel")} component={props => <CreateParcel {...props}/>}  /> 
      <ProtectedRoute path={alterPath("/")} component={(props)=><Home {...props}/>}  /> 
      </Switch>
    </Router> 
    </>
  );
}

export default App;
