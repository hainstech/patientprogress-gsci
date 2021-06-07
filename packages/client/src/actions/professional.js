import axios from 'axios';

import { setAlert } from './alert';
import { GET_PATIENT, PATIENT_ERROR } from './types';

const URI =
  process.env.NODE_ENV === 'production' ? 'https://api.patientprogress.ca' : '';

// Send email to api so it can send the email
export const invitePatient = (email) => async (dispatch) => {
  try {
    const config = {
      hearders: {
        'Content-Type': 'application/json',
      },
    };

    await axios.post(`${URI}/api/professionals/invite`, { email }, config);

    dispatch(setAlert(`Invitation sent to: ${email}`, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Get patient by ID
export const getPatient = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${URI}/api/patients/${id}`);

    dispatch({
      type: GET_PATIENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PATIENT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
