import { combineReducers } from 'redux';

import alert from './alert';
import auth from './auth';
import profile from './profile';
import questionnaire from './questionnaire';
import professional from './professional';

export default combineReducers({
  alert,
  auth,
  profile,
  questionnaire,
  professional,
});
