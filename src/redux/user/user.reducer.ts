import UserActionTypes from './user.types'
import firebase from "firebase";
import { RegistrationObject } from '../../components/interfaces/user.interface';

interface LocalUserState {
  currentUser: firebase.User | null,
  userInfo: RegistrationObject | null,
  error: any | null
}
const INITIAL_STATE: LocalUserState = {
  currentUser: null,
  error: null,
  userInfo: null
}

const userReducer = (state = INITIAL_STATE, action: { type: string; payload: any; }): LocalUserState => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        userInfo: null,
        error: null
      };
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    // case UserActionTypes.USERNAME_NODE_DATABASE_LISTENER_START: 
    //   return {
    //     ...state,
    //     userInfo: {...state.userInfo ,username: action.payload.username,},
    //   }

    case UserActionTypes.DATABASE_LISTENER_START:
      return {
        ...state,
        userInfo: action.payload
      }
    default:
      return state;
  }
};

export default userReducer;

