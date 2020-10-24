import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { selectCurrentUser } from './redux/user/user.selectors';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from './redux/user/user.actions';

import './App.css';
import Homepage from './components/homepage';
import 'antd/dist/antd.css';
import Login from './components/login';
import RegistrationForm from './components/register';
import UserProfile from './components/user-info';
import { RegistrationObject } from './components/interfaces/user.interface';
import { Col, Spin } from 'antd';

// const currentUser = true


interface IAppProps {
  setCurrentUserListener?: () => Promise<any>,
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>,
  currentUser?: firebase.User,
  userInfo?: RegistrationObject
}

const App = (props: IAppProps) => {
  const { currentUser, setCurrentUserListener, setCurrentUserRootDatabaseListener } = props;

  console.log("APP.TSX PROPS:  ", currentUser);

  const [loadingCredentials, setLoadingCredentials] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingCredentials(false)
    }, 1000);
  }, []);


  useEffect(() => {
    setCurrentUserListener!();
    setLoadingCredentials(true);
  }, [setCurrentUserListener, currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      console.log("CALLING DB LISTENER WITH CURRENT USER: ", currentUser);

      setCurrentUserRootDatabaseListener!(currentUser!.uid);
    }
  }, [setCurrentUserRootDatabaseListener, currentUser]);


  if (loadingCredentials) {
    return (
      <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center" }}>
        <Spin size="large" />
      </Col>
    );
  }

  return (
    <div className="App">
      {currentUser ? (
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/profile/:username" component={UserProfile} />
          {/* <Route
            exact
            path="/login"
            render={() => (currentUser ? <Redirect to="/" /> : <Redirect to="/" />)}
          /> */}
          <Route component={Homepage} />
        </Switch>
      ) : (
          <Switch>
            {/* <Route path='/login' component={Login} />
              <Route path='/register' component={RegistrationForm} />
              <Redirect
                to={{
                  pathname: window.location.pathname === "/register" ? '/register' : "/login"
                }}
              /> */}
            <Route exact path='/register' component={RegistrationForm} />
            <Route component={Login} />
          </Switch>
        )}
    </div>
  );
}

// const mapStateToProps = createStructuredSelector({
//   currentUser: selectCurrentUser,
// });

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
