import React from "react";
import { LinkOutlined, FileOutlined } from "@ant-design/icons";
import { PATH_PREFIX } from "../utils/Utils";
import { Link } from "react-router-dom";
// value, i
export const PropertySingleValue = (props) => {
  const { value, i } = props;
  if (value.type === "literal") {
    return <p key={i}>{value["@value"]}</p>;
  } else if (value.type === "resource") {
    return (
      <div key={i}>
        <FileOutlined />
        <Link
          to={
            PATH_PREFIX +
            "/" +
            value["value_resource_name"] +
            "/" +
            value["value_resource_id"]
          }
        >
          {value["display_title"]}
        </Link>
      </div>
    );
  } else if (value.type === "uri") {
    return (
      <div key={i}>
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
    <PropertySingleValue value={value} i={i} />
  ));
};

export default PropertyValue;
