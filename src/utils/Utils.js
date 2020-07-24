import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export const PlaceHolder = require("../resources/image-placeholder.png");

export const Logo = require("../resources/logo.png");

export const PATH_PREFIX = "/react";

export const getItem = (baseAddress, itemId) => {
  return axios.get("http://" + baseAddress + "/api/items/" + itemId);
};

export const getItems = (baseAddress, items) => {
  let requests = items.map((each) => getItem(baseAddress, each));
  return axios.all(requests);
};

export const searchItems = (baseAddress, params) => {
  return axios.get("http://" + baseAddress + "/api/items?per_page=10000", {
    params: params,
  });
};

export const getItemSetList = (baseAddress) => {
  return axios.get("http://" + baseAddress + "/api/item_sets?per_page=1000");
};

export const getItemSet = (baseAddress, itemSetId) => {
  return axios.get("http://" + baseAddress + "/api/item_sets/" + itemSetId);
};

export const getItemsInItemSet = (baseAddress, itemSetId) => {
  return axios.get(
    "http://" + baseAddress + "/api/items?item_set_id=" + itemSetId
  );
};

export const createItemSet = (userInfo, payload) => {
  return axios.post(userInfo.host + "/api/item_sets", payload, {
    params: {
      key_identity: userInfo.key_identity,
      key_credential: userInfo.key_credential,
    },
    headers: headers,
  });
};

export const addItemsToItemSet = (userInfo, itemSetId, items) => {
  if (!userInfo || !itemSetId || !items) {
    return;
  }
  let requests = items.map((each) => {
    return axios.get(userInfo.host + "/api/items/" + each).then((response) => {
      let originItemSets = response.data["o:item_set"]
        ? response.data["o:item_set"]
        : [];
      originItemSets.push({ "o:id": itemSetId });

      return axios.patch(
        userInfo.host + "/api/items/" + each,
        { "o:item_set": originItemSets },
        {
          params: {
            key_identity: userInfo.key_identity,
            key_credential: userInfo.key_credential,
          },
          headers: headers,
        }
      );
    });
  });
  return axios.all(requests);
};

export const getMedium = (baseAddress, medium) => {
  return axios.get("http://" + baseAddress + "/api/media/" + medium);
};

export const getMedia = (baseAddress, media) => {
  let requests = media.map((each) => getMedium(baseAddress, each));
  return axios.all(requests);
};

export const searchMedia = (baseAddress, params) => {
  return axios.get("http://" + baseAddress + "/api/media?per_page=10000", {
    params: params,
  });
};

export const getPropertyList = (baseAddress) => {
  return axios.get("http://" + baseAddress + "/api/properties?per_page=1000");
};

export const searchProperties = (baseAddress, params) => {
  return axios.get("http://" + baseAddress + "/api/properties?per_page=10000", {
    params: params,
  });
};

export const getResourceClassList = (baseAddress) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_classes?per_page=1000"
  );
};
