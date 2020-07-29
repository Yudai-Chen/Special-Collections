import React, { useState, useEffect } from "react";
import { List } from "antd";
import { PropertySingleValue } from "./PropertyValue";

// dataSource
const Metadata = (props) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setList(
      Object.keys(props.dataSource)
        .filter((each) => each !== "key")
        .filter((each) => each.charAt(0) !== "o" && each.charAt(0) !== "@")
        .map((property, index) => ({
          key: property,
          value: props.dataSource[property],
        }))
    );
  }, [props.dataSource]);

  useEffect(() => {
    setLoading(false);
  }, [list]);

  return loading ? null : (
    <div>
      <div align="center" className="ant-descriptions-title">
        Metadata
      </div>
      <List
        bordered={true}
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 10,
        }}
        dataSource={list}
        renderItem={(item) => (
          <List.Item key={item.key}>
            <List.Item.Meta title={item.value[0].property_label} />
            {typeof item.value === "string"
              ? item.value
              : Array.isArray(item.value)
              ? item.value.map((each, index) => (
                  <PropertySingleValue key={index} value={each} index={index} />
                ))
              : null}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Metadata;
