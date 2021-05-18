import axios from 'axios';
import { setAlert } from './alert';

import { GET_QUESTIONNAIRE, QUESTIONNAIRE_ERROR } from './types';

// Get questionnaire with the params id
export const getQuestionnaire = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/questionnaires/${id}`);

    dispatch({
      type: GET_QUESTIONNAIRE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUESTIONNAIRE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const createQuestionnaire = (schema, uischema) => async (dispatch) => {
  try {
    const config = {
      hearders: {
        'Content-Type': 'application/json',
      },
    };

    const questionnaire = {
      schema,
      uischema,
      title: schema.title,
    };

    await axios.post(`/api/questionnaires`, questionnaire, config);

    dispatch(setAlert('Questionnaire created', 'success'));
  } catch (err) {
    dispatch(setAlert(err.message, 'danger'));
  }
};

export const addQuestionnaire =
  (history, id, title, data) => async (dispatch) => {
    try {
      const config = {
        hearders: {
          'Content-Type': 'application/json',
        },
      };

      const questionnaire = {
        title: title,
        data: data,
      };

      await axios.post(`/api/questionnaires/${id}`, questionnaire, config);

      dispatch(setAlert('Questionnaire filled and sent', 'success'));

      history.push('/patient/questionnaires');
    } catch (err) {
      dispatch(setAlert(err.message, 'danger'));
    }
  };
