import React, { useEffect, useState } from "react";
import { Select } from "antd";
const { Option } = Select;

const PropertySelector = (props) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (props.availableProperties) {
      setOptions(
        props.availableProperties.map((property) => (
          <Option key={property["o:label"]} value={property["o:label"]}>
            {property["o:label"]}
          </Option>
        ))
      );

      setValue(props.availableProperties.map((property) => property["o:label"]));
    }
  }, [props.availableProperties]);

  useEffect(() => {
    props.setActiveProperties(
      props.availableProperties
        ? props.availableProperties.filter((property) =>
            value.includes(property["o:label"])
          )
        : []
    );
  }, [props.setActiveProperties, props.availableProperties, value]);

  const handleChange = (value) => {
    setValue(value);
    props.setActiveProperties(
      props.availableProperties.filter((property) =>
        value.includes(property["o:id"])
      )
    );
  };

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select fields"
      value={value}
      onChange={handleChange}
    >
      {options}
    </Select>
  );
};

export default PropertySelector;
