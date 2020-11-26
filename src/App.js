import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './page/login'
import CreateParcel from './page/createParcel'
import ManifestDetails from './page/manifestDetails'
import About from './page/about'
import PrinManifestDetails from './page/prinManifestDetails'
import {alterPath,UserProfile} from './utility'
import Home from './page/home'
import 'antd/dist/antd.css';
import './App.scss';

function App() {
  const [userProfileObject] = React.useState(UserProfile)
  React.useEffect(() => {

  },[userProfileObject]);

  const ProtectedRoute = (params) => {
    return UserProfile.getCredential() ? (<Route {...params} render={props=> <params.component {...props} />} />) : (<Redirect to={alterPath("/login")} />)
  }

  return (
    <Router>
      <Switch>
      <Route exact={true} path={alterPath("/login")} render={props=> <Login {...props} />} />
      <ProtectedRoute exact={true} path={alterPath("/about")} component={About}/>
      <ProtectedRoute exact={true} path={alterPath("/manifest/details")} component={ManifestDetails}/>
      <ProtectedRoute exact={true} path={alterPath("/manifest/print/")} component={PrinManifestDetails} />
      <ProtectedRoute exact={true} path={alterPath("/create-parcel")} component={CreateParcel}  /> 
      <ProtectedRoute path={alterPath("/")} component={Home}  /> 
      </Switch>
    </Router>
  );

}

export default App;
