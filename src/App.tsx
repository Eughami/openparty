import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  setCurrentUserListener,
  setCurrentUserRootDatabaseListener,
  setCurrentUserFollowingChangedListener,
  setCurrentUserEligiblePosts,
  setCurrentUserToken,
} from './redux/user/user.actions';

import './App.css';
import Homepage from './components/homepage';
import 'antd/dist/antd.css';
import Login from './components/login';
import RegistrationForm from './components/register';
import UserProfile from './components/user-info';
import Tags from './components/tags';
import { RegistrationObject } from './components/interfaces/user.interface';
import { Grid, message } from 'antd';
import Header from './components/header/header';
import MobileHeader from './components/header/mobile/mobile-header';
import ProfileUI from './components/test';
import EditAccount from './components/account/edit-account';

import firebase from 'firebase';
import ViewPost from './components/viewPost';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-popupbox/dist/react-popupbox.css';
import { LOADER_OBJECTS } from './components/images';
import Explore from './components/explore';
import MobileNavbar from './components/mobileNarbar';
import Activity from './components/header/mobile/pages/Activity';
import MobileComment from './components/header/mobile/pages/MobileComment';
import Inbox from './components/chats/inbox';

// const currentUser = true

const { useBreakpoint } = Grid;

interface IAppProps {
  setCurrentUserListener?: () => Promise<any>;
  setCurrentUserRootDatabaseListener?: (uid: string) => Promise<any>;
  setCurrentUserFollowingChangedListener?: (
    uid: string,
    uFP: Array<{ postRef: string; uidRef: string; username: string }>
  ) => Promise<any>;
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
    setCurrentUserFollowingChangedListener,
    setCurrentUserEligiblePosts,
    setCurrentUserToken,
    currentUserToken,
  } = props;

  const { xs } = useBreakpoint();

  useEffect(() => {
    if (!currentUser) {
      setCurrentUserListener!()
        .then(async (currentUser: any) => {
          if (currentUser && !currentUserToken) {
            await setCurrentUserToken!(currentUser);

            // await setCurrentUserRootDatabaseListener!(currentUser.uid);

            setLoadingCredentials(false);
          } else {
            setLoadingCredentials(false);
          }
        })
        .catch((e) => {
          console.log('@APP.TSX LOADING CRED ERROR: ', e);

          setLoadingCredentials(false);
          setLoadingCredentialsError({ error: e });
        });
    }
  }, [
    currentUserToken,
    currentUser,
    setCurrentUserListener,
    setCurrentUserToken,
    // setCurrentUserRootDatabaseListener,
  ]);

  useEffect(() => {
    if (!currentUserInfo && currentUser) {
      setCurrentUserRootDatabaseListener!(currentUser.uid);
      setCurrentUserEligiblePosts!(currentUser).then(
        (uFP: Array<{ postRef: string; uidRef: string; username: string }>) => {
          setCurrentUserFollowingChangedListener!(currentUser.uid, uFP);
        }
      );
    }
  }, [
    currentUserInfo,
    setCurrentUserRootDatabaseListener,
    currentUser,
    setCurrentUserEligiblePosts,
    setCurrentUserFollowingChangedListener,
  ]);

  console.log('APP.TSX PROPS:  ', props);

  const [loadingCredentials, setLoadingCredentials] = useState<boolean>(true);
  const [loadingCredentialsError, setLoadingCredentialsError] = useState<{
    error?: string | null;
  }>({ error: null });

  if (loadingCredentials) {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Spin size="small" />
        <p>Loading your stuff...</p> */}
        <img
          height="200"
          width="100"
          src={LOADER_OBJECTS.LOADING_PINKY_PIG_01}
          alt="LOADING"
        />
      </div>
    );
  }

  return (
    <div className="App">
      {loadingCredentialsError.error &&
        message.warning('An error ocurred...', 10)}
      {currentUser ? (
        <div>
          {xs ? (
            <div style={{ paddingBottom: '60px' }}>
              <MobileHeader />
            </div>
          ) : (
            <div style={{ paddingBottom: '60px' }}>
              <Header />
            </div>
          )}

          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/explore" component={Explore} />
            <Route exact path="/messages" component={Inbox} />
            <Route exact path="/:username" component={UserProfile} />
            <Route exact path="/t/:tag" component={Tags} />
            <Route exact path="/post/:postId" component={ViewPost} />
            <Route
              exact
              path="/post/:postId/comments"
              component={MobileComment}
            />
            <Route exact path="/account/edit" component={EditAccount} />
            <Route exact path="/account/activity" component={Activity} />
          </Switch>
          {/* here the mobile navbar */}
          {xs && currentUserInfo && (
            <div style={{ paddingTop: 60 }}>
              <MobileNavbar />
            </div>
          )}
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
    setCurrentUserFollowingChangedListener: (
      uid: string,
      uFP: Array<{ postRef: string; uidRef: string; username: string }>
    ) => dispatch(setCurrentUserFollowingChangedListener(uid, uFP)),
    setCurrentUserEligiblePosts: (currentUser: firebase.User) =>
      dispatch(setCurrentUserEligiblePosts(currentUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
