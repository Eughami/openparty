import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserEligiblePosts,
  setCurrentUserToken,
} from "./redux/user/user.actions";

import "./App.css";
import Homepage from "./components/homepage";
import "antd/dist/antd.css";
import Login from "./components/login";
import RegistrationForm from "./components/register";
import UserProfile from "./components/user-info";
import Tags from "./components/tags";
import { RegistrationObject } from "./components/interfaces/user.interface";
import { Spin } from "antd";
import Header from "./components/header/header";
import ProfileUI from "./components/test";

import firebase from "firebase";
import ViewPost from "./components/viewPost";
import "react-perfect-scrollbar/dist/css/styles.css";

// const currentUser = true

interface IAppProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserEligiblePosts?: (currentUser: firebase.User) => Promise<any>;
  setCurrentUserToken?: (currentUser: firebase.User) => Promise<string | null>;
  currentUser?: firebase.User;
  currentUserInfo?: RegistrationObject;
  currentUserToken?: string | null;
}

const App = (props: IAppProps) => {
  const {
    currentUser,
    currentUserInfo,
    setCurrentUserListener,
    setCurrentUserRootDatabaseListener,
    setCurrentUserEligiblePosts,
    setCurrentUserToken,
  } = props;

  useEffect(() => {
    if (!currentUser) {
      setCurrentUserListener!()
        .then((currentUser: any) => {
          setCurrentUserToken!(currentUser);
          setLoadingCredentials(false);
        })
        .catch(() => setLoadingCredentials(false));
    }
  }, [currentUser, setCurrentUserListener, setCurrentUserToken]);

  useEffect(() => {
    if (!currentUserInfo && currentUser) {
      setCurrentUserRootDatabaseListener!(currentUser.uid);
      setCurrentUserEligiblePosts!(currentUser);
    }
  }, [
    currentUserInfo,
    setCurrentUserRootDatabaseListener,
    currentUser,
    setCurrentUserEligiblePosts,
  ]);

  console.log("APP.TSX PROPS:  ", props.currentUserToken);

  const [loadingCredentials, setLoadingCredentials] = useState<boolean>(true);

  if (loadingCredentials) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="small" />
        <p>Loading your stuff...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {currentUser ? (
        <div>
          <div style={{ paddingBottom: "60px" }}>
            <Header />
          </div>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/:username" component={UserProfile} />
            <Route exact path="/t/:tag" component={Tags} />
            <Route exact path="/post/:postId" component={ViewPost} />
            <Route exact path="/test/p" component={ProfileUI} />

            {/* <Route component={Homepage} /> */}
          </Switch>
        </div>
      ) : (
        <Switch>
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
    currentUserToken: state.user.currentUserToken,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserToken: (currentUser: firebase.User) =>
      dispatch(setCurrentUserToken(currentUser)),
    setCurrentUserRootDatabaseListener: (uid: string) =>
      dispatch(setCurrentUserRootDatabaseListener(uid)),
    setCurrentUserEligiblePosts: (currentUser: firebase.User) =>
      dispatch(setCurrentUserEligiblePosts(currentUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
