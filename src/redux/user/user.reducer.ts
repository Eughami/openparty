import UserActionTypes from './user.types';
import firebase from 'firebase';
import {
  Post,
  RegistrationObject,
} from '../../components/interfaces/user.interface';

interface LocalUserState {
  currentUser: firebase.User | null;
  userInfo: RegistrationObject | null;
  currentUserEligiblePosts: Array<any>;
  currentUserActualEligiblePosts: Array<any>;
  currentUserToken: string | null;
  currentUserViewing: RegistrationObject | null;
  currentUserPostViewing: Post | null;
  currentUserActualEligiblePostsLoading: boolean;
  error: any | null;
  commentId: null | string;
}
const INITIAL_STATE: LocalUserState = {
  currentUser: null,
  error: null,
  userInfo: null,
  currentUserEligiblePosts: [],
  currentUserActualEligiblePosts: [],
  currentUserToken: null,
  currentUserPostViewing: null,
  currentUserViewing: null,
  currentUserActualEligiblePostsLoading: true,
  commentId: null,
};

const userReducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
): LocalUserState => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };
    case UserActionTypes.SET_NOTIFICATION_ID:
      return {
        ...state,
        commentId: action.payload,
      };
    case UserActionTypes.CLEAR_NOTIFICATION_ID:
      return {
        ...state,
        commentId: null,
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        userInfo: null,
        error: null,
      };
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS:
      return {
        ...state,
        currentUserEligiblePosts: action.payload,
      };

    case UserActionTypes.DATABASE_LISTENER_START:
      return {
        ...state,
        userInfo: action.payload,
      };
    case UserActionTypes.SET_CURRENT_USER_TOKEN:
      return {
        ...state,
        currentUserToken: action.payload,
      };
    case UserActionTypes.SET_CURRENT_USER_VIEWING:
      return {
        ...state,
        currentUserViewing: action.payload,
      };
    case UserActionTypes.SET_CURRENT_USER_POST_VIEWING:
      return {
        ...state,
        currentUserPostViewing: action.payload,
      };
    case UserActionTypes.SET_CURRENT_USER_ELIGIBLE_POSTS_LISTENER:
      return {
        ...state,
        currentUserActualEligiblePosts: action.payload,
        currentUserActualEligiblePostsLoading: false,
      };

    default:
      return state;
  }
};

export default userReducer;
