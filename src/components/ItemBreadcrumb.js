import React, { useState, useEffect } from "react";
import { getItemPath, PATH_PREFIX } from "../utils/Utils";
import { Breadcrumb, Spin } from "antd";
import { Link } from "react-router-dom";

// baseAddress, itemId, itemTitle
const ItemBreadcrumb = (props) => {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState([]);
  useEffect(() => {
    getItemPath(props.baseAddress, props.itemId).then((result) =>
      setPath(result.reverse())
    );
  }, [props.itemId, props.baseAddress]);

  useEffect(() => {
    setLoading(false);
  }, [path]);
  return loading ? (
    <Spin />
  ) : (
    <Breadcrumb>
      {path.map((each, key) => (
        <Breadcrumb.Item key={key}>
          <Link
            to={PATH_PREFIX + "/items/" + each["value_resource_id"]}
            target="_blank"
          >
            {each["display_title"]}
          </Link>
        </Breadcrumb.Item>
      ))}
      <Breadcrumb.Item>{props.itemTitle}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default ItemBreadcrumb;
