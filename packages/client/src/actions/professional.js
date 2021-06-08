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

// Send questionnaire to patient
export const sendQuestionnaire =
  (id, questionnaireToFill) => async (dispatch) => {
    try {
      const config = {
        hearders: {
          'Content-Type': 'application/json',
        },
      };

      await axios.put(
        `${URI}/api/patients/${id}`,
        { questionnaireToFill },
        config
      );

      dispatch(setAlert(`Sent successfully`, 'success'));
    } catch (err) {
      dispatch(setAlert(err.message, 'danger'));
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

// Get Questionnaire List
export const getQuestionnaireList = () => async (dispatch) => {
  try {
    const res = await axios.get(`${URI}/api/questionnaires/list`);
    return res;
  } catch (err) {
    return [];
  }
};
