import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { selectCurrentUser } from './redux/user/user.selectors';
import { setCurrentUserListener, setCurrentUserRootDatabaseListener } from './redux/user/user.actions';


import './App.css';
import Homepage from './components/homepage';

import 'antd/dist/antd.css';
import Login from './components/login';
import RegistrationForm from './components/register';

// const currentUser = true

const App = ({ currentUser, currentUserInfo, setCurrentUserListener, setCurrentUserRootDatabaseListener }: any) => {
  // {console.log(currentUser)}
  // useEffect(()=>{  
  //   checkUserSession()
  // },[checkUserSession])

  // useEffect(()=>{
  //   userUpated()
  // },[currentUser])
  // googleSignInStart('test@test.com', 'password123')

  // console.log("APP.TSX PROPS:", currentUser);


  useEffect(() => {
    setCurrentUserListener();
  }, [setCurrentUserListener, currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      console.log("CALLING DB LISTENER WITH CURRENT USER: ", currentUser);

      setCurrentUserRootDatabaseListener(currentUser.user.uid);
    }
  }, [setCurrentUserRootDatabaseListener, currentUser]);

  return (
    <div className="App">
      <Router>
        {currentUser ? (
          <Switch>
            <Route path="/" component={Homepage} />
            {/* <Route
              exact
              path="/login"
              render={() => (currentUser ? <Redirect to="/" /> : <Login />)}
            /> */}
            <Route component={Homepage} />
          </Switch>
        ) : (
            <Switch>
              {console.log('location: ',)}
              <Route path='/login' component={Login} />
              <Route path='/register' component={RegistrationForm} />
              <Redirect
                to={{
                  pathname: window.location.pathname === "/register" ? '/register' : "/login"
                }}
              />
              <Route component={Login} />
            </Switch>
          )}
      </Router>
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
  // checkUserSession: () => dispatch(checkUserSession()),
  // userUpated: () => dispatch(userUpated({})),
  return {
    setCurrentUserListener: () => dispatch(setCurrentUserListener()),
    setCurrentUserRootDatabaseListener: (uid: string) => dispatch(setCurrentUserRootDatabaseListener(uid))
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
