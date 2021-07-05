import axios from 'axios';
import { setAlert } from './alert';

const prefix = process.env.REACT_APP_BETA ? 'beta.' : '';
const URI =
  process.env.NODE_ENV === 'production'
    ? `https://${prefix}api.patientprogress.ca`
    : '';

// Get questionnaire with the params id
export const getQuestionnaire = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${URI}/api/questionnaires/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
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

    await axios.post(`${URI}/api/questionnaires`, questionnaire, config);

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

      await axios.post(
        `${URI}/api/questionnaires/${id}`,
        questionnaire,
        config
      );

      dispatch(setAlert('Questionnaire filled and sent', 'success'));

      history.push('/patient/questionnaires');
    } catch (err) {
      dispatch(setAlert(err.message, 'danger'));
    }
  };
