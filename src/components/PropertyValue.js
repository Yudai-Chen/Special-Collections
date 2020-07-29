import React from "react";
import { LinkOutlined, FileOutlined } from "@ant-design/icons";
import { PATH_PREFIX } from "../utils/Utils";
import { Link } from "react-router-dom";
// value, index
export const PropertySingleValue = (props) => {
  const { value, index } = props;
  if (value.type === "literal") {
    return <p key={index}>{value["@value"]}</p>;
  } else if (value.type === "resource") {
    return (
      <div key={index}>
        <FileOutlined />
        <Link
          to={
            PATH_PREFIX +
            "/" +
            value["value_resource_name"] +
            "/" +
            value["value_resource_id"]
          }
          target="_blank"
        >
          {value["display_title"]}
        </Link>
      </div>
    );
  } else if (value.type === "uri") {
    return (
      <div key={index}>
        <LinkOutlined />
        <a target="_blank" href={value["@id"]}>
          {value["@id"]}
        </a>
      </div>
    );
  }
  return null;
};
// values
const PropertyValue = (props) => {
  return props.values.map((value, i) => (
    <PropertySingleValue key={i} value={value} index={i} />
  ));
};

export default PropertyValue;
