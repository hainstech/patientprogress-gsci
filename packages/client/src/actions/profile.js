import axios from 'axios';
import { setAlert } from './alert';
import i18n from '../i18n';

import { GET_PROFILE, PROFILE_ERROR } from './types';

const prefix = process.env.REACT_APP_BETA ? 'beta.' : '';
const URI =
  process.env.NODE_ENV === 'production'
    ? `https://${prefix}api.patientprogress.ca`
    : '';

// Get current users profile
export const getCurrentProfile = (type) => async (dispatch) => {
  try {
    const res = await axios.get(`${URI}/api/${type}s/me`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Edit profile
export const editProfile = (type, formData, history) => async (dispatch) => {
  try {
    const config = {
      hearders: {
        'Content-Type': 'application/json',
      },
    };

    await axios.put(`${URI}/api/${type}s`, formData, config);

    dispatch(setAlert(i18n.t('alert.updatedSuccessfully'), 'success'));
    switch (type) {
      case 'patient':
        history.push(`/patient/profile`);
        break;
      case 'professional':
        history.push(`/professional/preferences`);
        break;
      default:
        history.push(`/${type}/profile`);
        break;
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
