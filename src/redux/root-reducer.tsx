import {combineReducers} from 'redux'
import userReducer from './user/user.reducer'

const rootReducer = combineReducers({
  // counter: CounterReducer
  user: userReducer
})

export default rootReducer