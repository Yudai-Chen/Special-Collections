import { SET_QUERY } from "./actionTypes";

export const setQuery = (endpoint, params, size) => {
  return {
    type: SET_QUERY,
    payload: {
      endpoint,
      params,
      size,
    },
  };
};
