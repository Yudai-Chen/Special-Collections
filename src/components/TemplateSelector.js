import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Select } from "antd";

import { fetchTemplates } from "../utils/OmekaS";
import Axios from "axios";

const { Option } = Select;

const TemplateSelector = (props) => {
  // May be able to initially define availableProperties and options?

  const [options, setOptions] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [initialRender, setInitialRender] = useState(0);
  
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    // get templates options on load
    const fetchOptions = async () => {
      const res = await fetchTemplates(cookies.userInfo.host);
      setTemplates(res.data);

      setOptions(
        res.data.map((template) => (
          <Option key={template["o:id"]} value={template["o:id"]}>
            {template["o:label"]}
          </Option>
        ))
      );
    };
    fetchOptions();
    setInitialRender(1);

  }, [cookies]);

  useEffect(() => {
    if(initialRender == 1){
      handleChange(1);
      setInitialRender(0);
    }
  }, [templates])

  const handleChange = async (value) => {

    //props.setActiveProperties();
    
    const template = templates.filter(
      (template) => template["o:id"] === value
    )[0];

    const requests = template["o:resource_template_property"].map((property) =>
      Axios.get(property["o:property"]["@id"])
    );

    const res = await Axios.all(requests);
    const properties = res.map((inner) => inner.data);
    
    
    props.setAvailableProperties(properties);
  };

  return (
    <Select
      style={{ width: "100%" }}
      placeholder="Please select template"
      onChange={handleChange}
      defaultValue = {"Base Resource"}
    >
      {options}
    </Select>
  );
};

export default TemplateSelector;
