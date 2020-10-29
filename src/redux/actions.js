import { ADD_QUERY_PARAM, SET_QUERY } from "./actionTypes";

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

export const addQueryParam = (key, value) => {
  return {
    type: ADD_QUERY_PARAM,
    payload: {
      key,
      value,
    },
  };
};
