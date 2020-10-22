import UserActionTypes from './user.types'
import { User } from '../../components/interfaces/user.interface'

const INITIAL_STATE = {
  currentUser: null,
  error: null,
  userInfo: null
}

const userReducer = (state = INITIAL_STATE, action: any) => {
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
        error: null
      };
    case UserActionTypes.SET_CURRENT_USER_START: {
      return {
        ...state
      }
    }
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        error: action.payload
      };
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

