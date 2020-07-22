import axios from "axios";
import { useCookies } from "react-cookie";

export const PlaceHolder = require("../resources/image-placeholder.png");

export const Logo = require("../resources/logo.png");

export const PATH_PREFIX = "/react";

export const getItem = (baseAddress, itemId) => {
    return axios.get(baseAddress + "/api/items/" + itemId);
}

export const getItems = (baseAddress, items) => {
    let requests = items.map((each) => getItem(baseAddress, each));
    return axios.all(requests).then(axios.spread((...responses) => responses)).catch((error) => console.log(error));
}
