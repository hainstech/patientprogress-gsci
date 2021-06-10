import { combineReducers } from 'redux';

import alert from './alert';
import auth from './auth';
import profile from './profile';
import professional from './professional';

export default combineReducers({
  alert,
  auth,
  profile,
  professional,
});
