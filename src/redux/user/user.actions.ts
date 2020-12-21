import { RegistrationObject } from '../../components/interfaces/user.interface';
import UserActionTypes from './user.types';
import firebase from 'firebase';
import axios from 'axios';
import {
  API_BASE_URL,
  API_BASE_URL_OPEN,
  GET_USER_ELIGIBLE_POST_ENDPOINT,
  REGISTRATION_ENDPOINT,
} from '../../service/api';
// import _ from 'lodash';

export const googleSignInStart = () => (dispatch: any) =>
  new Promise(async (resolve, reject) => {
    dispatch({ type: UserActionTypes.GOOGLE_SIGN_IN_START });
    try {
      firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((user) => {
          console.log('googleSignIn', user);

          dispatch({ type: UserActionTypes.SIGN_IN_SUCCESS });
          resolve(user.user);
        })
        .catch((error) => {
          dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
          reject(error);
        });
    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_IN_FAILURE });
      reject(error);
    }
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
          history.replace('/');
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
  new Promise(async (resolve, reject) => {
    console.log('AUTH STATE CHANGED! Called');

    try {
      firebase.auth().onAuthStateChanged(async (user) => {
        console.log('AUTH STATE CHANGED! ', user);

        if (user) {
          dispatch({ type: UserActionTypes.SET_CURRENT_USER, payload: user });
        } else {
          dispatch({ type: UserActionTypes.SIGN_OUT_SUCCESS });
        }
        resolve(user);
      });
    } catch (error) {
      console.log('AUTH STATE CHANGED! ', error);
      reject(error);
    }
  });

export const setCurrentUserToken = (currentUser: firebase.User) => (
  dispatch: any
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!currentUser) {
        resolve('');
        return;
      }
      const token = await currentUser.getIdToken(true);
      dispatch({
        type: UserActionTypes.SET_CURRENT_USER_TOKEN,
        payload: token,
      });
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });

export const setCurrentUserRootDatabaseListener = (uid: string) => (
  dispatch: (arg0: { type: string; payload: any }) => void,
  getState: any
) => {
  return new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Users')
        .child(uid)
        .on('value', (userSnap) => {
          console.log('NOW LISTENING ON NODE: ', userSnap.val());
          console.log('PREV USER INFO: ', getState());
          if (getState().user.userInfo) {
            console.log('USER INFO PREV STATE ACTIVE');

            const prevUserInfo = getState().user.userInfo as RegistrationObject;
            const newUserInfo = userSnap.val() as RegistrationObject;
            // if (newUserInfo.followers_count !== prevUserInfo.followers_count) {
            //   console.log('NOT DISPATCHING FOR FOLLOW COUNT');
            //   return;
            // }
            if (newUserInfo.following_count < prevUserInfo.following_count) {
              console.log('NOT DISPATCHING FOR FOLLOWING LESS COUNT');
              return;
            }
          }

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
};

export const setCurrentUserEligiblePosts = (currentUser: firebase.User) => (
  dispatch: (arg0: { type: string; payload: any }) => void
) =>
  new Promise(async (resolve, reject) => {
    try {
      const token = await currentUser.getIdToken();

      //Get eligible posts for the user
      const result = await axios.get(
        // 'http://localhost:5000/openpaarty/us-central1/api/v1/posts/users-eligible-post',
        `${API_BASE_URL}${GET_USER_ELIGIBLE_POST_ENDPOINT}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS,
        payload: result.data.uFP,
      });
      resolve(result.data.uFP);
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

export const setCurrentUserFollowingChangedListener = (
  uid: string,
  uFP: Array<{ postRef: string; uidRef: string; username: string }>
) => (dispatch: (arg0: { type: string; payload: any }) => void) =>
  new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref('Following')
        .child(uid)
        .on('child_removed', (userFollowingSnap) => {
          console.log(
            'NOW LISTENING ON FOLLOWING NODE: ',
            userFollowingSnap.val()
          );

          //whenever user stops following someone, dispatch action to get eligible posts again.
          // setCurrentUserEligiblePosts(firebase.auth().currentUser!);
          dispatch({
            type: UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS,
            payload: uFP.filter(
              (ref) => ref.uidRef !== userFollowingSnap.val().uid
            ),
          });
          resolve(userFollowingSnap.val());
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
export const signUpStart = (userObj: RegistrationObject, history: any) => {
  const registerKey = 'registration';

  let object: any = userObj;
  //attaching the auth
  object.auth = 'api@openparty.com';
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `EnHzwn2fBib4tgzKNBzXBcNAHSq1`,
    },
    body: JSON.stringify(object),
  };
  const url = `${API_BASE_URL_OPEN}${REGISTRATION_ENDPOINT}`;
  console.log('before sending register request', userObj);

  return (dispatch: any) =>
    new Promise((resolve, reject) => {
      dispatch({ type: UserActionTypes.SIGN_UP_START });
      return fetch(url, requestOptions).then(
        (response) => {
          if (response.ok) {
            response.json().then((resJson) => {
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
              reject(res.message);
            });
          } else if (response.status === 500) {
            response.json().then((res) => {
              dispatch({
                type: UserActionTypes.SIGN_UP_FAILURE,
                payload: res.message,
              });
              console.log(res);
              reject(res.message.message);
            });
          } else {
            dispatch({
              type: UserActionTypes.SIGN_UP_FAILURE,
              payload: 'Unauthorized',
            });
            reject('Unauthorized');
          }
        },
        (error) => {
          dispatch({
            type: UserActionTypes.SIGN_UP_FAILURE,
            payload: error,
          });
          console.log('Error :', error);
          reject('SignUp Failed');
        }
      );
    });
};

export const signUpSuccess = (userObj: RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userObj,
});

export const signUpFailure = (error: any) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error,
});
