import { RegistrationObject } from '../../components/interfaces/user.interface';
import UserActionTypes from './user.types';

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

export const emailSignInStart = (emailAndPassword: any) => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: emailAndPassword
});

export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION
});

export const userUpated  = (currentUser:any) => ({
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

export const signUpSuccess = (userObj:RegistrationObject) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: userObj
});

export const signUpFailure = (error:any) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error
});
