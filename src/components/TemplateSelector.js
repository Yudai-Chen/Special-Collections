import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Select } from "antd";

import { connect } from "react-redux";

import { clearQuery, setQuery } from "../redux/actions";

import { fetchTemplates } from "../utils/OmekaS";
import { fetchSize } from "../utils/OmekaS";

import Axios from "axios";

const { Option } = Select;

const mapStateToProps = (state, props) => {
  return {
    ...props,
    query: state.query,
  };
};

const TemplateSelector = (props) => {
  const defaultId = 6; // Default is "Source"
  // May be able to initially define availableProperties and options?

  const [options, setOptions] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    // get templates options on load
    const fetchOptions = async () => {
      const res = await fetchTemplates(cookies.userInfo.host);
      setTemplates(res);

      setOptions(
        res.map((template) => (
          <Option key={template["o:id"]} value={template["o:id"]}>
            {template["o:label"]}
          </Option>
        ))
      );
    };

    fetchOptions();
  }, [cookies]);

  const handleChange = async (value) => {
    const template = templates.filter(
      (template) => template["o:id"] === value
    )[0];

    const requests = template["o:resource_template_property"].map((property) =>
      Axios.get(property["o:property"]["@id"])
    );

    const res = await Axios.all(requests);
    const properties = res.map((inner) => inner.data);

    props.setAvailableProperties(properties);
    props.clearQuery("items");

    // console.log("query before")
    // console.log(props.query)

    const search = {}
    search["resource_class_id"] = template["o:resource_class"]["o:id"]
    props.setQuery("items", search, 99999);

    // console.log("query after")
    // console.log(props.query)

    // fetchSize(cookies.userInfo.host, "items", props.query["params"]).then((count) =>
    //   props.setQuery("items", {}, count)
    // );
  };

  useEffect(() => {
    if (templates.length > 0) {
      handleChange(defaultId);
    }
  }, [templates]);

  return (
    <Select
      style={{ width: "100%" }}
      placeholder="Please select template"
      onChange={handleChange}
      defaultValue={defaultId}
    >
      {options}
    </Select>
  );
};

//export default TemplateSelector;
export default connect(mapStateToProps, { clearQuery, setQuery })(
  TemplateSelector
);
