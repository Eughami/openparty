import { RegistrationObject } from '../../components/interfaces/user.interface';
import UserActionTypes from './user.types';
import firebase from 'firebase';
import { API_BASE_URL, REGISTRATION_ENDPOINT } from '../../service/api';
import { toast } from 'react-toastify';
import { resolve } from 'dns';


export const googleSignInStart = () => ({
  type: UserActionTypes.GOOGLE_SIGN_IN_START,
});

export const signInSuccess = (user: any) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error: any) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

export const emailSignInStart = (
  emailAndPassword: { email: string; password: string },
  history: any
) => (dispatch: (arg0: { type: string; payload?: any }) => void) =>
  new Promise((resolve, reject) => {
    dispatch({ type: UserActionTypes.EMAIL_SIGN_IN_START });

    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          emailAndPassword.email,
          emailAndPassword.password
        )
        .then((user) => {
          dispatch({
            type: UserActionTypes.SIGN_IN_SUCCESS,
            payload: user.user,
          });
          resolve(user);
          history.push('/');
        })
        .catch((error) => {
          dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
          reject(error);
        });
    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
      reject(error);
    }
  });

export const setCurrentUserListener = () => (dispatch: any) =>
  new Promise((resolve, reject) => {
    try {
      firebase.auth().onAuthStateChanged((user) => {
        console.log('AUTH STATE CHANGED! ', user);

        if (user) {
          const token = await user.getIdToken(true);
          console.log(token);

          localStorage.setItem("userToken", token);

          dispatch({ type: UserActionTypes.SET_CURRENT_USER, payload: user });
        } else {
          dispatch({ type: UserActionTypes.SIGN_OUT_SUCCESS });
        }

        resolve(user);
      });
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserRootDatabaseListener = (uid: string) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Users')
        .child(uid)
        .on('value', (userSnap) => {
          console.log('NOW LISTENING ON NODE: ', userSnap.val());

          dispatch({
            type: UserActionTypes.DATABASE_LISTENER_START,
            payload: userSnap.val(),
          });
          resolve(userSnap.val());
        });
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserUsernameDatabaseListener = (uid: string) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Users')
        .child(uid)
        .child('username')
        .on('value', (userSnap) => {
          console.log('NOW LISTENING ON USERNAME NODE: ', userSnap.val());

          dispatch({
            type: UserActionTypes.USERNAME_NODE_DATABASE_LISTENER_START,
            payload: userSnap.val(),
          });
          resolve(userSnap.val());
        });
    } catch (error) {
      reject(error);
    }
  });

export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION,
});

export const userUpated = (currentUser: any) => ({
  type: UserActionTypes.USER_UPDATED,
  payload: currentUser,
});

export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START,
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error: any) => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error,
});

export const signUpSuccess = (registrationObject: RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: registrationObject,
});

export const signUpStart = (userObj: RegistrationObject, history: any) => {
  let object: any = userObj;
  const BEARER_TOKEN =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxMGM4ZjhiMGRjN2Y1NWUyYjM1NDFmMjllNWFjMzc0M2Y3N2NjZWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiZXVnaGFtaSIsInBpY3R1cmUiOiJodHRwczovL2ZpcmViYXNlc3RvcmFnZS5nb29nbGVhcGlzLmNvbS92MC9iL29wZW5wYWFydHkuYXBwc3BvdC5jb20vby9kZWZhdWx0cyUyRnByb2ZpbGVfcGljdHVyZSUyRmRlZmF1bHQucHJvZmlsZS1pbWFnZS5wbmc_YWx0PW1lZGlhJnRva2VuPWMwZWU5NDU1LTM2YzYtNDU2Mi1iZmUzLWViODZlMDJlNTE4OCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9vcGVucGFhcnR5IiwiYXVkIjoib3BlbnBhYXJ0eSIsImF1dGhfdGltZSI6MTYwMzkxMDc2NCwidXNlcl9pZCI6IlJTWm0yNjVKWERZeWFRNHZHeFFGZTJRYjVydzIiLCJzdWIiOiJSU1ptMjY1SlhEWXlhUTR2R3hRRmUyUWI1cncyIiwiaWF0IjoxNjAzOTIxNjY4LCJleHAiOjE2MDM5MjUyNjgsImVtYWlsIjoiaW1hbW9zaTUwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGhvbmVfbnVtYmVyIjoiKzkwNTQ4ODQ4NzY1MiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkwNTQ4ODQ4NzY1MiJdLCJlbWFpbCI6WyJpbWFtb3NpNTBAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.U0cgjepw0IJx44KQNU7FX0V2gaq9OxYsuMp4ylYpxHeaQrzgPWEu0ScSGkqrEdJlEe8AlVslfNzTHEgzqLLkkqSaZ80hwwPsDxlkcR6QxvYV1B8M4xdA8bFwjePoKfUL5bDbCEww1wMgTPIUzl0iTYUdkCsfx8Jkd1u-w7aRWH8A4wceSs4Gd-lZFNX7xMW_FwSskaRyWsYXvr5kzU21u3OO9hgbfl9kbQktrMu0JtCPbYGea-uqr5sGhsOTbf6J024mItdukE4YWc1BqhocXuAd_p1m0GTNEunpmgSRqGDoG5YktggsWUlG_5tUQc-jAPRTacQmM4A80eSDEJZwHw';
  //attaching the auth
  object.auth = 'api@openparty.com';
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify(object),
  };
  const url = `${API_BASE_URL}${REGISTRATION_ENDPOINT}`;
  console.log(userObj);

  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      dispatch({ type: UserActionTypes.SIGN_UP_START });
      return fetch(url, requestOptions).then(
        (response) => {
          if (response.ok) {
            response.json().then((resJson) => {
              console.log(resJson);
              toast.success('SignUp Successful');
              dispatch({
                type: UserActionTypes.SIGN_UP_SUCCESS,
                payload: userObj,
              });
              resolve(true);
            });
          } else if (response.status === 409) {
            response.json().then((res) => {
              dispatch({
                type: UserActionTypes.SIGN_UP_FAILURE,
                payload: res.message,
              });
              console.log(res);
              toast.error(res.message);
              reject(false);
            });
          } else if (response.status === 500) {
            response.json().then((res) => {
              dispatch({
                type: UserActionTypes.SIGN_UP_FAILURE,
                payload: res.message,
              });
              console.log(res);
              toast.error(res.message.message);
              reject(false);
            });
          } else {
            dispatch({
              type: UserActionTypes.SIGN_UP_FAILURE,
              payload: 'Unauthorized',
            });
            toast.error('Unauthorized');
            reject(false);
          }
        },
        (error) => {
          dispatch({
            type: UserActionTypes.SIGN_UP_FAILURE,
            payload: error,
          });
          console.log('Error :', error);
          toast.error('SignUp Failed');
          reject(false);
        }
      );
    });
};

export const signUpFailure = (error: any) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error,
});
