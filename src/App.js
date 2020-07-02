import React, {useState} from 'react';
import Login from './page/login'
import CreateParcel from './page/createParcel'
import ManifestDetails from './page/manifestDetails'
import PrinManifestDetails from './page/prinManifestDetails'
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
  const [state, setState] = useState({isLogin:true});
  return (
    <Router>
      <Switch>
          <Route exact={true} path="/login" render={props=> <Login {...props}/>} />
          <Route exact={true} path="/parcel" render={props=> <CreateParcel {...props}/>} />
          <Route exact={true} path="/manifest/details/:id" render={props=> <ManifestDetails {...props}/>} />
          <Route exact={true} path="/manifest/print" render={props=> <PrinManifestDetails {...props}/>} />
          <Route path="/" render={props=> state.isLogin ? <Home {...props}/> : <Redirect to="/login" /> }/>
        </Switch>
        
        
    </Router>
  );
}

export default App;
