import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user.selectors';
import { checkUserSession,/* signOutStart */userUpated } from './redux/user/user.actions';


import './App.css';
import Homepage from './components/homepage';

import 'antd/dist/antd.css';
import Login from './components/login';
import RegistrationForm from './components/register';

// const currentUser = true

const App = ({currentUser,checkUserSession,userUpated}:any) => {
  {console.log(currentUser)}
  useEffect(()=>{
    checkUserSession()
  },[checkUserSession])

  useEffect(()=>{
    userUpated()
  },[currentUser])
  // googleSignInStart('test@test.com', 'password123')
  return (
    <div className="App">
      <Router>
      {currentUser ? (
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route
            exact
            path="/login"
            render={() => (currentUser ? <Redirect to="/" /> : <Login />)}
          />
          <Route component={Homepage} />
        </Switch>
      ) : (
        <Switch>
          {console.log('location: ', )}
          <Route path='/login' component={Login} />
          <Route  path='/register' component={RegistrationForm} />
            <Redirect
              to={{
                pathname: window.location.pathname === "/register" ? '/register' : "/login"
              }}
            />
        </Switch>
      )}
      </Router>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = (dispatch:any) =>({
  checkUserSession: () => dispatch(checkUserSession()),
  userUpated: () => dispatch(userUpated({})),
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
