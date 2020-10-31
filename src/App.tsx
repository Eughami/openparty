import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { selectCurrentUser } from './redux/user/user.selectors';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
} from './redux/user/user.actions';

import './App.css';
import Homepage from './components/homepage';
import 'antd/dist/antd.css';
import Login from './components/login';
import RegistrationForm from './components/register';
import UserProfile from './components/user-info';
import { RegistrationObject } from './components/interfaces/user.interface';
import { Col, Spin } from 'antd';
import firebase from 'firebase';

import 'react-toastify/dist/ReactToastify.css';

// const currentUser = true

interface IAppProps extends RouteComponentProps<any> {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
}

const App = (props: IAppProps) => {
  const { currentUser, currentUserInfo, setCurrentUserListener, setCurrentUserRootDatabaseListener } = props;

  useEffect(() => {
    if (!currentUser)
      setCurrentUserListener!()

  }, [currentUser, setCurrentUserListener])

  useEffect(() => {
    if (!currentUserInfo && currentUser)
      setCurrentUserRootDatabaseListener!(currentUser.uid);
  }, [currentUserInfo, setCurrentUserRootDatabaseListener, currentUser])


  console.log("APP.TSX PROPS:  ", currentUser);

  // useEffect(() => {
  //   if (!currentUser) return;
  //   console.log("@DB TEST EFFECT ", currentUser?.email);

  //   firebase.database().ref("Postsv2").child("iILfbJyqoPaoV5yjPZuMwIBXCVn1/0").on("value", snapshot => {
  //     console.log("@DB DEBUG ", snapshot.val());

  //   }, (error: any) => {
  //     console.log(error);

  //   })
  // }, [currentUser])

  // return (
  //   <div>
  //     {
  //       currentUser ?
  //         currentUser.uid : "TESTING"

  //     }
  //   </div>
  // );


  // const [loadingCredentials, setLoadingCredentials] = useState<boolean>(true);

  // if (loadingCredentials) {
  //   return (
  //     <Col span="12" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "5%", textAlign: "center" }}>
  //       <Spin size="large" />
  //     </Col>
  //   );
  // }

  return (
    <div className="App">
      {currentUser ? (
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/profile/:username" component={UserProfile} />
          <Route
            exact
            path="/login"
            render={() =>
              currentUser ? <Redirect to="/" /> : <Redirect to="/" />
            }
          />
          {/* <Route component={Homepage} /> */}
        </Switch>
      ) : (
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              !currentUser ? <Redirect to="/login" /> : <Redirect to="/" />
            }
          />
          <Route path="/login" component={Login} />
          {/* <Route path='/register' component={RegistrationForm} />
              <Redirect
                to={{
                  pathname: window.location.pathname === "/register" ? '/register' : "/login"
                }}
              /> */}
          <Route exact path="/register" component={RegistrationForm} />
          <Route component={Login} />
        </Switch>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUser: state.user.currentUser,
    currentUserInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
