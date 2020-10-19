import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user.selectors';

import {
  googleSignInStart,
  emailSignInStart
} from './redux/user/user.actions';




import './App.css';
import Homepage from './components/homepage';

import 'antd/dist/antd.css';
import Login from './components/login';

// const currentUser = false

const App = ({currentUser, emailSignInStart,googleSignInStart}:any) => {
  {console.log(currentUser)}
  emailSignInStart('test@test.com', 'password123')
  return (
    <div className="App">
      <Router>
      {currentUser ? (
        <Switch>
          <Route exact path="/" component={Homepage} />
          {/* <Route exact path="/addnew" component={AddNewStudentPage} /> */}
          {/* <Route exact path="/listall" component={ListAllStudentsPage} /> */}
          <Route
            exact
            path="/login"
            render={() => (currentUser ? <Redirect to="/" /> : <Login />)}
          />
          <Route component={Homepage} />
        </Switch>
      ) : (
        <Switch>
          <Route component={Login} />
        </Switch>
      )}
      </Router>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});
const mapDispatchToProps = (dispatch: any) => ({
  googleSignInStart: () => dispatch(googleSignInStart()),
  emailSignInStart: (email:any, password:any) =>
    dispatch(emailSignInStart({ email, password }))
});


export default connect(mapStateToProps,mapDispatchToProps)(App);
