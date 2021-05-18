import {
  CLEAR_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  AUTH_ERROR,
} from '../actions/types';

const initialState = {
  profile: null,
  loading: true,
  error: {},
};

export default function profile(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PROFILE:
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };
    case CLEAR_PROFILE:
    case AUTH_ERROR:
      return {
        ...state,
        profile: null,
      };
    default:
      return state;
  }
}
