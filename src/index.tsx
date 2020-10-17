import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyAqmmh2U3EF0D5H7cU_gtUDGua6J-pJmT8",
  authDomain: "openpaarty.firebaseapp.com",
  databaseURL: "https://openpaarty.firebaseio.com",
  projectId: "openpaarty",
  storageBucket: "openpaarty.appspot.com",
  messagingSenderId: "1068571012809",
  appId: "1:1068571012809:web:fe037ded9b36d40fdfe718",
  measurementId: "G-1GCM1NG8CM"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
