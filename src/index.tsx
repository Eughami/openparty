import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
// import ScrollMemory from 'react-router-scroll-memory';

import firebase from 'firebase';
import { CleanConsole } from '@eaboy/clean-console';

firebase.initializeApp({
  apiKey: 'AIzaSyAqmmh2U3EF0D5H7cU_gtUDGua6J-pJmT8',
  authDomain: 'openpaarty.firebaseapp.com',
  databaseURL: 'https://openpaarty.firebaseio.com',
  projectId: 'openpaarty',
  storageBucket: 'openpaarty.appspot.com',
  messagingSenderId: '1068571012809',
  appId: '1:1068571012809:web:fe037ded9b36d40fdfe718',
  measurementId: 'G-1GCM1NG8CM',
});

localStorage.removeItem('postsSet');
localStorage.removeItem('otherUserPostsSet');
localStorage.removeItem('publicUserPostsSet');
localStorage.removeItem('tagPostsSet');
localStorage.removeItem('selfUserInfoPostsSet');

// remove logger from production
if (process.env.NODE_ENV === 'development') {
  CleanConsole.init({
    clearOnInit: true,
  });
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <ScrollMemory /> */}
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
