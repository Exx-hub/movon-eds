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
          <Route exact={true} path="/staging/login" render={props=> <Login {...props} />} />
          <Route exact={true} path="/staging/parcel" render={props=> getCredential() ? <CreateParcel {...props}/> : <Redirect to="/staging/login" /> }/>
          <Route exact={true} path="/staging/manifest/details" render={props=> getCredential() ? <ManifestDetails {...props}/>: <Redirect to="/staging/login" /> }/>
          <Route exact={true} path="/staging/manifest/print/" render={props=> getCredential() ? <PrinManifestDetails {...props}/> : <Redirect to="/staging/login" /> }/>
          <Route path="/" render={props=> getCredential() ? <Home {...props}/> : <Redirect to="/staging/login" /> }/>
        </Switch>
    </Router>
  );

}

export default App;
