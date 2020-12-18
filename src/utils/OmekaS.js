import axios from "axios";

const PER_PAGE = 9999;

export const fetch = async (
  baseAddress,
  endpoint,
  itemSetId,
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
      item_set_id: itemSetId !== -1 ? itemSetId : null,
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

  console.log(data.slice(0, limit));

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
  const res = await axios.get(
    `http://${baseAddress}/api/resource_templates?per_page=${PER_PAGE}`
  );

  return res.data;
};

export const fetchItemSets = async (baseAddress) => {
  const res = await axios.get(
    `http://${baseAddress}/api/item_sets?per_page=${PER_PAGE}`
  );
  return res.data;
};

export const fetchOne = async (baseAddress, endpoint, id) => {
  const res = await axios.get(`http://${baseAddress}/api/${endpoint}/${id}`);
  return res.data;
};
