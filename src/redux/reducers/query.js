import { ADD_QUERY_PARAM, SET_QUERY, SET_ITEM_SET } from "../actionTypes";

const initialState = {
  endpoint: "items",
  params: {},
  size: 99999, // big number
  item_set_id: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_QUERY: {
      const { endpoint, params, size } = action.payload;

      return {
        ...state,

        endpoint,
        params,
        size,
      };
    }

    case ADD_QUERY_PARAM: {
      const { key, value } = action.payload;

      const params = {
        ...state.params,
      };

      params[key] = value;

      return {
        ...state,
        params,
      };
    }

    case SET_ITEM_SET: {
      const { n } = action.payload;

      return {
        ...state,
        item_set_id: n,
      };
    }

    default: {
      return state;
    }
  }
};
