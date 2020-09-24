import { SET_QUERY } from "../actionTypes";

const initialState = {
  endpoint: "items",
  params: {},
  size: 99999, // big number
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

    default: {
      return state;
    }
  }
};
