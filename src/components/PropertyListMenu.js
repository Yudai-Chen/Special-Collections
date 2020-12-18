import React, { useState, useEffect } from "react";
import { Spin, Select } from "antd";

const { Option } = Select;

// handleChange, originalProperties, extraProperties, defaultProperties
const PropertyListMenu = (props) => {
  const [loading, setLoading] = useState(true);
  const [propertyList, setPropertyList] = useState(props.extraProperties);

  useEffect(() => {
    setLoading(true);
    setPropertyList([...props.extraProperties, ...props.originalProperties]);
  }, [props.originalProperties]);

  useEffect(() => {
    setLoading(false);
  }, [propertyList]);

  return loading ? (
    <Spin />
  ) : (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select Properties"
      defaultValue={props.defaultProperties.map((each) => each["o:term"])}
      onChange={props.handleChange}
    >
      {propertyList.map((each) => (
        <Option key={each["o:term"]}>{each["o:label"]}</Option>
      ))}
    </Select>
  );
};

export default PropertyListMenu;
