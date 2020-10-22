import { takeLatest, put, all, call } from 'redux-saga/effects';

import UserActionTypes from './user.types';

import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure
} from './user.actions';

import {
  auth,
  googleProvider,
  createUserProfileDocument,
  getCurrentUser,
  userUpdated
} from '../../firebase/firebase.utils';
import { RegistrationObject } from '../../components/interfaces/user.interface';

export function* getSnapshotFromUserAuth(userAuth:any, additionalData:any) {
  try {
    const userSnapshot = yield call(
      createUserProfileDocument,
      userAuth,
      additionalData
    );
    console.log("user returned Snapshot : ", userSnapshot)
    // const currentUser = userSnapshot.val()
    yield put(signInSuccess(userSnapshot));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithGoogle() {
  try {
    const { user } = yield auth.signInWithPopup(googleProvider);
    yield getSnapshotFromUserAuth(user, null);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signInWithEmail({ payload: { email, password } }:any) {
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield console.log('user detilas : ', user)
    // yield getSnapshotFromUserAuth(user,null);
    yield put(signInSuccess({}));

  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    if (!userAuth) return;
    yield put(signInSuccess({}));
    // yield getSnapshotFromUserAuth(userAuth,null);
  } catch (error) {
    yield put(signInFailure(error));
  }
}
export function* isUserUpdated() {
  try {
    yield userUpdated();
    // if (!userAuth) return;
    // yield getSnapshotFromUserAuth(userAuth,null);
  } catch (error) {
    yield console.log(error);
  }
}

export function* signOut() {
  try {
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* signUp({payload:{...regdata}}:any) {
  try {
    const {email, password} = regdata
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    console.log("returned user from signup success, ",user)
    yield getSnapshotFromUserAuth(user,regdata)
    // yield put(signUpSuccess(user));
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

export function* signInAfterSignUp({ payload: { ...regdata } }:any) {
  yield getSnapshotFromUserAuth(regdata, null);
}

export function* onGoogleSignInStart() {
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onUserUpadated() {
  yield takeLatest(UserActionTypes.USER_UPDATED, isUserUpdated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
  yield all([
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onUserUpadated),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess)
  ]);
}
