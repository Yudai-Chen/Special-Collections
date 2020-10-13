import React, { useEffect } from "react";
import { Select } from "antd";
const { Option } = Select;

const PropertySelector = (props) => {
  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select fields"
    ></Select>
  );
};

export default PropertySelector;
