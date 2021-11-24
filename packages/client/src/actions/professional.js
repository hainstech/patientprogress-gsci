import axios from 'axios';

import i18n from '../i18n';
import { setAlert } from './alert';
import { GET_PATIENT, PATIENT_ERROR } from './types';

const prefix = process.env.REACT_APP_BETA ? 'beta.' : '';
const URI =
  process.env.NODE_ENV === 'production'
    ? `https://${prefix}api.patientprogress.ca`
    : '';

// Send email to api so it can send the email
export const invitePatient = (email) => async (dispatch) => {
  try {
    const config = {
      hearders: {
        'Content-Type': 'application/json',
      },
    };

    await axios.post(`${URI}/api/professionals/invite`, { email }, config);

    dispatch(setAlert(`${i18n.t('alert.invitationSent')} ${email}`, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Send questionnaire to patient
export const sendQuestionnaires =
  (id, questionnairesToFill) => async (dispatch) => {
    try {
      const config = {
        hearders: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post(
        `${URI}/api/patients/${id}/questionnaireToFill`,
        { questionnairesToFill },
        config
      );

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

// Get patient by ID
export const getPatient = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${URI}/api/patients/${id}`);

    dispatch({
      type: GET_PATIENT,
      payload: res.data,
    });

    return res.data;
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

// Remove Questionnaire from the questionnaireToSend list
export const removeQuestionnaire = (patient, id) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `${URI}/api/patients/questionnairesToFill/${patient}/${id}`
    );

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

// Send report
export const sendReport = (id, report) => async (dispatch) => {
  try {
    const config = {
      hearders: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      `${URI}/api/patients/${id}/report`,
      { report },
      config
    );

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

// send Re-Evaluation Report
export const sendReEvaluationReport = (id, report) => async (dispatch) => {
  try {
    const config = {
      hearders: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      `${URI}/api/patients/${id}/reevaluationreport`,
      { report },
      config
    );

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
