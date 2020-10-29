import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Select } from "antd";
import { addQueryParam } from "../redux/actions";

import { connect } from "react-redux";

import { fetchItemSets } from "../utils/OmekaS";
const { Option } = Select;

const ItemSetSelector = (props) => {
  const [options, setOptions] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    // get templates options on load
    const fetchOptions = async () => {
      const res = await fetchItemSets(cookies.userInfo.host);
      console.log(res);

      const itemSetOptions = res.map((template) => (
        <Option key={template["o:id"]} value={template["o:id"]}>
          {template["o:title"]}
        </Option>
      ));

      const globalOption = (
        <Option key={-1} value={-1}>
          All Items
        </Option>
      );

      setOptions([globalOption].concat(itemSetOptions));
    };

    fetchOptions();
  }, [cookies]);

  const handleChange = async (value) => {
    if (value !== -1) {
      props.addQueryParam("item_set_id", value);
    } else {
      props.addQueryParam("item_set_id", null);
    }
  };

  return (
    <Select
      style={{ width: "100%" }}
      placeholder="Please select item set"
      defaultValue={-1}
      onChange={handleChange}
    >
      {options}
    </Select>
  );
};

export default connect(null, { addQueryParam })(ItemSetSelector);
