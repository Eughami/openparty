import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user.selectors';

import './App.css';
import Homepage from './components/homepage';

import 'antd/dist/antd.css';
import Login from './components/login';

// const currentUser = true

const App = (currentUser:any) => {
  {console.log(currentUser)}
  // googleSignInStart('test@test.com', 'password123')
  return (
    <div className="App">
      <Router>
      {currentUser.currentUser ? (
        <Switch>
          {console.log('user is autenticated')}
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
          {console.log('user is not autenticated')}
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

export default connect(mapStateToProps)(App);
