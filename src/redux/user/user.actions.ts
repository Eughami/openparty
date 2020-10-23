import { RegistrationObject } from '../../components/interfaces/user.interface';
import UserActionTypes from './user.types';
import firebase from "firebase";

export const googleSignInStart = () => ({
  type: UserActionTypes.GOOGLE_SIGN_IN_START
});

export const signInSuccess = (user: any) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user
});

export const signInFailure = (error: any) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error
});

export const emailSignInStart = (emailAndPassword: { email: string, password: string }) => (dispatch: (arg0: { type: string; payload?: any; }) => void) =>
  new Promise((resolve, reject) => {
    dispatch({ type: UserActionTypes.EMAIL_SIGN_IN_START });

    try {
      firebase.auth().signInWithEmailAndPassword(emailAndPassword.email, emailAndPassword.password)
        .then((user) => {
          dispatch({ type: UserActionTypes.SIGN_IN_SUCCESS, payload: user.user });
          resolve(user);
        })
        .catch((error) => {
          dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error })
          reject(error)
        })

    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
      reject(error)
    }

  });

export const setCurrentUserListener = () => (dispatch: any) =>
  new Promise((resolve, reject) => {

    try {
      firebase.auth().onAuthStateChanged((user) => {
        console.log("AUTH STATE CHANGED! ", user);

        if (user) {
          dispatch({ type: UserActionTypes.SET_CURRENT_USER, payload: user });
        }
        else {
          dispatch({ type: UserActionTypes.SIGN_OUT_SUCCESS });
        }

        resolve(user);
      });

    } catch (error) {
      reject(error)
    }

  });

export const setCurrentUserRootDatabaseListener = (uid: string) => (dispatch: (arg0: { type: string; payload: any; }) => void) =>
  new Promise((resolve, reject) => {

    try {
      firebase.database().ref("Users").child(uid).on("value", userSnap => {
        console.log("NOW LISTENING ON NODE: ", userSnap.val());

        dispatch({ type: UserActionTypes.DATABASE_LISTENER_START, payload: userSnap.val() });
        resolve(userSnap.val());
      })

    } catch (error) {
      reject(error)
    }

  });

export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION
});

export const userUpated = (currentUser: any) => ({
  type: UserActionTypes.USER_UPDATED,
  payload: currentUser
});

export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS
});

export const signOutFailure = (error: any) => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error
});

export const signUpStart = (registrationObject: RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: registrationObject
});

export const signUpSuccess = (userObj: RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userObj
});

export const signUpFailure = (error: any) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error
});
