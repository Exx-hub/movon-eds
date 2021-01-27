import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from './page/login'
import CreateParcel from './page/createParcel'
import CreateParcelV2 from './page/createParcel/parcel.create'
import ManifestDetails from './page/manifestDetails'
import About from './page/about'
import PrinManifestDetails from './page/prinManifestDetails'
import {alterPath,UserProfile} from './utility'
import Home from './page/home'
import 'antd/dist/antd.css';
import './App.scss';
import InternetStatus from './assets/no_internet_connection.jpg'

function App() {
  const [internetConnection, setInternetConnection] = React.useState(false)

  window.addEventListener('online', () => setInternetConnection(true));
  window.addEventListener('offline', () => setInternetConnection(false));

  React.useEffect(()=>{
    setInternetConnection(navigator.onLine)
  },[])

  React.useEffect(() => { 
    console.info('internet-connection',internetConnection) 
  },[internetConnection]);

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
      <ProtectedRoute exact={true} path={alterPath("/create-parcel-v2")} component={CreateParcelV2}  /> 
      <ProtectedRoute path={alterPath("/")} component={Home}  /> 
      </Switch>
    </Router>
  );
  // if(internetConnection){
  //   return (
  //     <Router>
  //       <Switch>
  //       <Route exact={true} path={alterPath("/login")} render={props=> <Login {...props} />} />
  //       <ProtectedRoute exact={true} path={alterPath("/about")} component={About}/>
  //       <ProtectedRoute exact={true} path={alterPath("/manifest/details")} component={ManifestDetails}/>
  //       <ProtectedRoute exact={true} path={alterPath("/manifest/print/")} component={PrinManifestDetails} />
  //       <ProtectedRoute exact={true} path={alterPath("/create-parcel")} component={CreateParcel}  /> 
  //       <ProtectedRoute exact={true} path={alterPath("/create-parcel-v2")} component={CreateParcelV2}  /> 
  //       <ProtectedRoute path={alterPath("/")} component={Home}  /> 
  //       </Switch>
  //     </Router>
  //   );
  // }else{
  //   return(<div className="no-internet-connection" />)
  // }
}

export default App;
