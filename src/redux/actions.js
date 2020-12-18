import {
  ADD_QUERY_PARAM,
  SET_QUERY,
  CLEAR_QUERY,
  SET_ITEM_SET,
} from "./actionTypes";

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

export const clearQuery = (endpoint) => {
  return {
    type: CLEAR_QUERY,
    payload: {
      endpoint,
      params: {},
      size: 9999,
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

export const setItemSet = (n) => {
  return {
    type: SET_ITEM_SET,
    payload: {
      n,
    },
  };
};
