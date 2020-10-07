import React, { useEffect, useState } from "react";
import { Select, Input } from "antd";
const { Option } = Select;

const QueryBuilder = (props) => {
  const options = props.tableColumns.map((column) => (
    <Option value={column.title}>{column.title}</Option>
  ));
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    console.log("here");
    setFilters(
      props.tableColumns
        .filter((column) => column.active === true)
        .map((column) => (
          <Input
            key={column.title}
            placeholder="press Enter to query"
            addonBefore={column.title}
            onPressEnter={(e) => {
              console.log(column.title + ": " + e.target.value);

              // change store "params" given title, e.target.value
            }}
          />
        ))
    );
  }, [props.tableColumns]);

  const select = (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={props.tableColumns
        .filter((column) => column.active === true)
        .map((column) => column.title)}
      onChange={(values) => {
        console.log(values);
        props.setTableColumns(
          props.tableColumns.map((column) => ({
            ...column,
            active: values.includes(column.title),
          }))
        )}
      }
    >
      {options}
    </Select>
  );

  return (
    <>
      {select}
      {filters}
    </>
  );
};

export default QueryBuilder;
