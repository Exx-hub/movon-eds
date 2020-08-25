import React from 'react';
import Login from './page/login'
import CreateParcel from './page/createParcel'
import ManifestDetails from './page/manifestDetails'
import PrinManifestDetails from './page/prinManifestDetails'
import {getCredential} from './utility'
import Home from './page/home'
import 'antd/dist/antd.css';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {

  return (
    <Router>
      <Switch>
          <Route exact={true} path="/login" render={props=> <Login {...props} />} />
          <Route exact={true} path="/parcel" render={props=> getCredential() ? <CreateParcel {...props}/> : <Redirect to="/login" /> }/>
          <Route exact={true} path="/manifest/details" render={props=> getCredential() ? <ManifestDetails {...props}/>: <Redirect to="/login" /> }/>
          <Route exact={true} path="/manifest/print/" render={props=> getCredential() ? <PrinManifestDetails {...props}/> : <Redirect to="/login" /> }/>
          <Route path="/" render={props=> getCredential() ? <Home {...props}/> : <Redirect to="/login" /> }/>
        </Switch>
    </Router>
  );

}

export default App;
