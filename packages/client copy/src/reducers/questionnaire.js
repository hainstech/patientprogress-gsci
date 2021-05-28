import { GET_QUESTIONNAIRE, QUESTIONNAIRE_ERROR } from '../actions/types';

const initialState = {
  questionnaire: null,
  loading: true,
  error: {},
};

export default function profile(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_QUESTIONNAIRE:
      return {
        ...state,
        questionnaire: payload,
        loading: false,
      };
    case QUESTIONNAIRE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        questionnaire: null,
      };
    default:
      return state;
  }
}
