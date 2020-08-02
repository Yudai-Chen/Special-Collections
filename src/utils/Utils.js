import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export const PlaceHolder = require("../resources/image-placeholder.png");

export const Logo = require("../resources/SClogo.png");

export const PATH_PREFIX = "/react";

export const getItem = (baseAddress, itemId) => {
  return axios.get("http://" + baseAddress + "/api/items/" + itemId);
};

export const getItems = (baseAddress, items) => {
  let requests = items.map((each) => getItem(baseAddress, each));
  return axios.all(requests);
};

export const searchItems = (baseAddress, params) => {
  return axios.get("http://" + baseAddress + "/api/items?per_page=1000", {
    params: params,
  });
};

export const createItem = (userInfo, payload) => {
  return axios.post("http://" + userInfo.host + "/api/items", payload, {
    params: {
      key_identity: userInfo.key_identity,
      key_credential: userInfo.key_credential,
    },
    headers: headers,
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
  return axios.post("http://" + userInfo.host + "/api/item_sets", payload, {
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
    return axios
      .get("http://" + userInfo.host + "/api/items/" + each)
      .then((response) => {
        let originItemSets = response.data["o:item_set"]
          ? response.data["o:item_set"]
          : [];
        originItemSets.push({ "o:id": itemSetId });

        return axios.patch(
          "http://" + userInfo.host + "/api/items/" + each,
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

export const getMediaInItem = (baseAddress, itemId) => {
  return axios.get(
    "http://" + baseAddress + "/api/media?per_page=1000&item_id=" + itemId
  );
};

export const searchMedia = (baseAddress, params) => {
  return axios.get("http://" + baseAddress + "/api/media?per_page=1000", {
    params: params,
  });
};

export const getPropertyList = (baseAddress) => {
  return axios.get("http://" + baseAddress + "/api/properties?per_page=1000");
};

export const searchProperties = (baseAddress, params) => {
  return axios.get("http://" + baseAddress + "/api/properties?per_page=1000", {
    params: params,
  });
};

export const getResourceClassList = (baseAddress) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_classes?per_page=1000"
  );
};

export const searchResourceClasses = (baseAddress, params) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_classes?per_page=1000",
    {
      params: params,
    }
  );
};

export const getResourceTemplateList = (baseAddress) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_templates?per_page=1000"
  );
};

export const getResourceTemplate = (baseAddress, templateId) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_templates/" + templateId
  );
};

export const getPropertiesInResourceTemplate = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((response) => {
    let requests = response.data[
      "o:resource_template_property"
    ].map((property) => axios.get(property["o:property"]["@id"]));
    return axios.all(requests);
  });
};

export const getItemPath = (baseAddress, itemId, path = []) => {
  return getItem(baseAddress, itemId).then((response) => {
    if (response.data["dcterms:isPartOf"]) {
      path.push(...response.data["dcterms:isPartOf"]);
      return getItemPath(
        baseAddress,
        response.data["dcterms:isPartOf"][0]["value_resource_id"],
        path
      );
    } else {
      return path;
    }
  });
};

export const patchItem = (userInfo, itemId, payload) => {
  return axios.patch(
    "http://" + userInfo.host + "/api/items/" + itemId,
    payload,
    {
      params: {
        key_identity: userInfo.key_identity,
        key_credential: userInfo.key_credential,
      },
      headers: headers,
    }
  );
};
