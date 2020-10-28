import { RegistrationObject } from '../../components/interfaces/user.interface';
import UserActionTypes from './user.types';
import firebase from "firebase";
import axios from 'axios'

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

export const emailSignInStart = (emailAndPassword: { email: string, password: string }, history?: any) => (dispatch: (arg0: { type: string; payload?: any; }) => void) =>
  new Promise((resolve, reject) => {
    dispatch({ type: UserActionTypes.EMAIL_SIGN_IN_START });

    try {
      firebase.auth().signInWithEmailAndPassword(emailAndPassword.email, emailAndPassword.password)
        .then((user) => {
          dispatch({ type: UserActionTypes.SIGN_IN_SUCCESS, payload: user.user });
          if (history) {
            history.replace("/");
          }
          resolve(user);
        })
        .catch((error) => {
          dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
          reject(error)
        })

    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_IN_FAILURE, payload: error });
      reject(error)
    }

  });

export const setCurrentUserListener = () => (dispatch: any) =>
  new Promise(async (resolve, reject) => {

    try {
      firebase.auth().onAuthStateChanged(async (user) => {
        console.log("AUTH STATE CHANGED! ", user);

        if (user) {
          const token = await user.getIdToken(true);
          console.log(token);

          localStorage.setItem("userToken", token);

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

export const setCurrentUserUsernameDatabaseListener = (uid: string) => (dispatch: (arg0: { type: string; payload: any; }) => void) =>
  new Promise((resolve, reject) => {

    try {
      firebase.database().ref("Users").child(uid).child("username").on("value", userSnap => {
        console.log("NOW LISTENING ON USERNAME NODE: ", userSnap.val());

        dispatch({ type: UserActionTypes.USERNAME_NODE_DATABASE_LISTENER_START, payload: userSnap.val() });
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

export const signUpStart = (registrationObject: RegistrationObject) => (dispatch: (arg0: { type: string; payload?: any; }) => void) =>
  new Promise(async (resolve, reject) => {
    dispatch({ type: UserActionTypes.SIGN_UP_START });

    try {
      const registerResponse = await axios.post("https://us-central1-openpaarty.cloudfunctions.net/register_user",
        {
          email: registrationObject.email,
          username: registrationObject.username,
          phone: registrationObject.phone,
          prefix: `+${registrationObject.prefix}`,
          password: registrationObject.password,
          auth: "api@openparty.com",
        });
      const registerData = registerResponse.data as { user?: RegistrationObject, success: boolean, message?: string | any, status?: number };
      console.log("REGISTER DATA: ", registerData);

      if (!registerData.success) {
        dispatch({ type: UserActionTypes.SIGN_UP_FAILURE, payload: registerData });
        resolve(registerData);
      }
      else {
        emailSignInStart({ email: registrationObject.email, password: registrationObject.password })
        // dispatch({ type: UserActionTypes.SIGN_UP_SUCCESS, payload: registerData });

        resolve(registerData);
      }

    } catch (error) {
      dispatch({ type: UserActionTypes.SIGN_UP_FAILURE, payload: error });
      reject(error)
    }

  });;

export const signUpSuccess = (userObj: RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userObj
});

export const signUpFailure = (error: any) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error
});
