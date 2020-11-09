const UserActionTypes = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_CURRENT_USER_START: 'SET_CURRENT_USER_START',
  GOOGLE_SIGN_IN_START: 'GOOGLE_SIGN_IN_START',
  EMAIL_SIGN_IN_START: 'EMAIL_SIGN_IN_START',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE',
  CHECK_USER_SESSION: 'CHECK_USER_SESSION',
  SIGN_OUT_START: 'SIGN_OUT_START',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAILURE: 'SIGN_OUT_FAILURE',
  SIGN_UP_START: 'SIGN_UP_START',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
  SIGN_UP_FAILURE: 'SIGN_UP_FAILURE',
  USER_UPDATED: 'USER_UPDATED',
  DATABASE_LISTENER_START: "DATABASE_LISTENER_START",
  USERNAME_NODE_DATABASE_LISTENER_START: "USERNAME_NODE_DATABASE_LISTENER_START",
  SET_CURRENT_USER_ELIGIBLE_POSTS: "SET_CURRENT_USER_ELIGIBLE_POSTS",
  SET_CURRENT_USER_TOKEN: "SET_CURRENT_USER_TOKEN"
};

export default UserActionTypes;
