import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';

const middleWares = [];
middleWares.push(thunk);

// remove logger from production
if (process.env.NODE_ENV === 'production') {
  middleWares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middleWares));

export default store;
