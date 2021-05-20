import axios from 'axios';
import { setAlert } from './alert';

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
