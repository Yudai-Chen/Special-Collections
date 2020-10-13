import axios from "axios";

export const fetch = async (
  baseAddress,
  endpoint,
  params,
  start,
  limit,
  sortBy = "id",
  sortOrder = "asc"
) => {
  const perPage = limit + (start % limit);
  const page = Math.ceil(start / perPage) + 1;

  const res = await axios.get(`http://${baseAddress}/api/${endpoint}`, {
    params: {
      ...params,
      sort_by: sortBy,
      sort_order: sortOrder,
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

export const fetchTemplates = async (baseAddress) => {
  return await axios.get(
    "http://" + baseAddress + "/api/resource_templates?per_page=1000"
  );
};
