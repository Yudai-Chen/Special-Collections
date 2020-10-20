import React, { useEffect, useState } from "react";
import { Select, Input, Table } from "antd";

import { setQuery } from "../redux/actions";

import { connect } from "react-redux";
import { fetchSize } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const { Option } = Select;

const mapStateToProps = (state, props) => {
  return {
    ...props,
    query: state.query,
  };
};

const QueryBuilder = (props) => {
  const options = props.activeProperties.map((column) => (
    <Option value={column.title}>{column.title}</Option>
  ));

  const [filters, setFilters] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      width: "15%",
    },
    {
      title: "Filter",
      dataIndex: "filter",
      key: "filter",
      width: "15%",
    },
  ];

  useEffect(() => {
    setFilters(
      props.activeProperties
        .filter((column) => column.active === true)
        .map((column) => (
          <Input
            key={column.title}
            placeholder="press Enter to query"
            addonBefore={column.title}
            onPressEnter={(e) => {
              handleEnter(e, column.id);
              // change store "params" given title, e.target.value
            }}
          />
        ))
    );

    setRows(
      props.activeProperties.map((element) => ({
        property: element["o:label"],
        title: element["o:label"],
        dataIndex: "o:" + element["o:local_name"],
        key: "o:" + element["o:local_name"],
        filter: (
          <Input
            key={"o:" + element["o:local_name"]}
            placeholder="press Enter to Query"
            onPressEnter={(e) => {
              handleEnter(e, element["o:id"]);
            }}
          />
        ),
        // render: title => <a>{title}</a>
      }))
    );
  }, [props.activeProperties]);

  const handleEnter = (e, property_index) => {
    //property_list[property_index] will give us name of field
    let search = { fulltext_search: "" };
    //if there is a value to query based on
    if (e.target.value) {
      search["property[" + property_index + "][joiner]"] = "and";
      search["property[" + property_index + "][property]"] = property_index;
      search["property[" + property_index + "][type]"] = "in";
      search["property[" + property_index + "][text]"] = e.target.value;

      fetchSize(cookies.userInfo.host, "items", search).then((count) =>
        props.setQuery("items", search, count)
      );
    }
  };

  const select = (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={props.activeProperties
        .filter((column) => column.active === true)
        .map((column) => column.title)}
      onChange={(values) => {
        props.setActiveProperties(
          props.activeProperties.map((column) => ({
            ...column,
            active: values.includes(column.title),
          }))
        );
      }}
    >
      {options}
    </Select>
  );

  // Return a table object where each row is a field, the first column is the name
  // of the field and the second column is the value being queried
  return (
    <>
      <Table dataSource={rows} columns={columns} />
    </>
  );
};

//export default QueryBuilder;
export default connect(mapStateToProps, { setQuery })(QueryBuilder);
