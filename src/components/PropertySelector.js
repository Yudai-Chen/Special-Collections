import React, { useEffect, useState } from "react";
import { Select } from "antd";
const { Option } = Select;

const PropertySelector = (props) => {

  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);

  const [initialRender, setInitialRender] = useState(0);

  useEffect(() => {
    if (props.availableProperties) {
      setOptions(
        props.availableProperties.map((property) => (
          <Option key={property["o:id"]} value={property["o:label"]}>
            {property["o:label"]}
          </Option>
        ))
      );

      setValue(["Title"]);
    }
    setInitialRender(0);
  }, [props.availableProperties]);

  useEffect(() => {
    if(!props.activeProperties && props.availableProperties){
      console.log(props.availableProperties)
      props.setActiveProperties(
        props.availableProperties.filter((property) => 
        property["o:label"] === "Title"
        )
      )
    }
  }, [props.availableProperties])

  useEffect(() => {
    if (value === []) {
      setValue(["Title"])
    }
  }, [value])

  const handleChange = (value) => {
    setInitialRender(1);
    setValue(value);
    props.setActiveProperties(
      props.availableProperties.filter((property) =>
        value.includes(property["o:label"]) || (property["o:label"] === "Title")
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
