import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Select } from "antd";

import { fetchTemplates } from "../utils/OmekaS";
import { template } from "@babel/core";

const { Option } = Select;

const TemplateSelector = (props) => {
  const [options, setOptions] = useState([]);

  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    // get templates options
    console.log("Getting templates");

    const fetchOptions = async () => {
      const templates = await fetchTemplates(cookies.userInfo.host);

      console.log(templates)

      setOptions(
        templates.data.map((template) => (
          <Option key={template["o:id"]} value={template["o:id"]}>
            {template["o:label"]}
          </Option>
        ))
      );
    };

    fetchOptions();
  }, [cookies]);

  const onChange = () => {

  }

  return <Select placeholder="Please select template">{options}</Select>;
};

export default TemplateSelector;
