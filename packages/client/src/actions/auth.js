import axios from 'axios';
import i18n from '../i18n';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';

const prefix = process.env.REACT_APP_BETA ? 'beta.' : '';
const URI =
  process.env.NODE_ENV === 'production'
    ? `https://${prefix}api.patientprogress.ca`
    : '';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${URI}/api/auth`);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({
    name,
    language,
    gender,
    dob,
    email,
    password,
    research,
    professional,
    dataConsent,
    participantConsent,
    terms,
  }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      name,
      language,
      gender,
      dob,
      email,
      password,
      research,
      professional,
      dataConsent,
      participantConsent,
      terms,
    });

    try {
      const res = await axios.post(`${URI}/api/users`, body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User
export const login =
  (email, password, recaptchaRef, emailCode) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const recaptchaValue = recaptchaRef.current?.getValue();

    const body = JSON.stringify({ email, password, recaptchaValue, emailCode });

    try {
      const res = await axios.post(`${URI}/api/auth`, body, config);

      if (res.data.token) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });

        dispatch(loadUser());

        return false;
      } else {
        let alertMsg = i18n.t(`alert.${res.data.status}`);
        let color = res.data.status === 'emailSent' ? 'success' : 'danger';

        recaptchaRef.current?.reset();
        dispatch(setAlert(alertMsg, color, 5000));
        dispatch({
          type: LOGIN_FAIL,
        });
        return { code: true };
      }
    } catch (err) {
      const errors = err.response.data.errors;

      recaptchaRef.current?.reset();

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };

// Check if the captcha is required or not
export const getCaptcha = () => async (dispatch) => {
  try {
    const res = await axios.get(`${URI}/api/auth/captcha`);
    return res.data.captcha;
  } catch (err) {
    console.log(err.message);
  }
};

// Send Password reset email
export const sendForgotEmail = (email, recaptchaValue) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, recaptchaValue });

  try {
    await axios.post(`${URI}/api/auth/forgot`, body, config);
    dispatch(setAlert(i18n.t('alert.forgotSent'), 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Reset password
export const setNewPassword =
  (password, id, token, recaptchaValue, history) => async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      password,
      id,
      token,
      recaptchaValue,
    });

    try {
      await axios.post(`${URI}/api/auth/passwordreset`, body, config);

      dispatch(setAlert(i18n.t('alert.reset'), 'success'));

      history.push(`/login`);
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
    }
  };

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};
