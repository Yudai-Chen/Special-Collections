import React, { useState, useEffect } from "react";
import { Spin, Select } from "antd";
import { getPropertyList } from "../utils/Utils";
import { useCookies } from "react-cookie";

const { Option } = Select;

// handleChange, extraProperties, defaultProperties
const PropertyListMenu = (props) => {
  const [loading, setLoading] = useState(true);
  const [propertyList, setPropertyList] = useState(props.extraProperties);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    setLoading(true);
    getPropertyList(cookies.userInfo.host).then((response) => {
      setPropertyList([...props.extraProperties, ...response.data]);
    });
  }, [cookies.userInfo]);

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
