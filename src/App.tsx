import React, { useEffect, useState } from 'react';
import './App.css';
import Homepage from './components/homepage';
import UserProfile from './pages/user-profile';
import Login from './pages/login'
import Register from './pages/register';
import Navbar from './components/navbar';
import { Switch, Route, } from "react-router-dom"; 
import { Spin, Col } from "antd";
import 'antd/dist/antd.css';
import  firebase from "firebase";

interface IAppProps { 
}

const App = (__props: IAppProps) => {
  console.log(__props);
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();
  const [loadingCredentials, setLoadingCredentials] = useState<boolean>(true);

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingCredentials(false);
    })

    return unsub;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoadingCredentials(false)
    }, 2000);
  }, []);

  if(loadingCredentials) {
    return (
      <Col span="12" style={{marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center"}}>
        <Spin size="large" />
      </Col>
    );
  }
  return (
    <div className="App">
      {
        currentUser ? 
        (
          <div>
            <Navbar user={currentUser} />
            <Switch>
                <Route exact path="/" component={Homepage} />
                <Route  exact path="/profile/:username" component={UserProfile} />  
                <Route  exact path="/register" component={Register} />  
                <Route component={Homepage} />
            </Switch> 
          </div>
        )
        : 
        (
          <div>
            <Route path="/" component={Login} />  
          </div>
        )

      }


    </div>
  );
}

export default App;
