import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT,
  GET_PATIENT,
  PATIENT_ERROR,
} from '../actions/types';

const initialState = {
  patient: null,
  loading: true,
};

export default function professional(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PATIENT:
      return {
        ...state,
        patient: payload,
        loading: false,
      };
    case PATIENT_ERROR:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        patient: null,
        loading: false,
      };
    default:
      return state;
  }
}
