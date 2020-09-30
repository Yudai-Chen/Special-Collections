import axios from "axios";

export const fetch = async (baseAddress, endpoint, params, start, limit) => {
  const perPage = limit + start % limit;
  const page = Math.ceil(start / perPage) + 1;


  const res = await axios.get(`http://${baseAddress}/api/${endpoint}`, {
    params: {
      ...params,
      page,
      per_page: perPage,
    },
  });

  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));

  return data.slice(0, limit);
};

export const fetchSize = async (baseAddress, endpoint, params) => {
  const res = await axios.get(`http://${baseAddress}/api/${endpoint}`, {
    params: {
      ...params,
      per_page: Number.MAX_SAFE_INTEGER,
    },
  });

  return res.data.length;
};
