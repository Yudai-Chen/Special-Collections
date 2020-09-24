import axios from "axios";

const bufferSize = 10;

export const fetch = async (baseAddress, endpoint, params, start, limit) => {
  const page = Math.floor(start / bufferSize) + 1;
  const offset = start % bufferSize;

  const res = await axios.get(`http://${baseAddress}/api/${endpoint}`, {
    params: {
      ...params,
      page,
      per_page: bufferSize,
    },
  });

  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));

  return data.slice(offset, offset + limit); // TODO will not fetch more than pagesize
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
