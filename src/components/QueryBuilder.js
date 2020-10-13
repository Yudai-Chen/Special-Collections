<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Select, Input } from "antd";

import { setQuery } from "../redux/actions";

import { connect } from "react-redux";
import { fetchSize } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const { Option } = Select;
=======
import React from "react";
import { Input } from "antd";
>>>>>>> a8eda1e802a529ef8a34672c2e6b031efb9b27b7

const mapStateToProps = (state, props) => {
  return{
    ...props,
    query: state.query
  }
}

const QueryBuilder = (props) => {
  const options = props.tableColumns.map((column) => (
    <Option value={column.title}>{column.title}</Option>
  ));
  const [filters, setFilters] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    setFilters(
      props.tableColumns
        .filter((column) => column.active === true)
        .map((column) => (
          <Input
            key={column.title}
            placeholder="press Enter to query"
            addonBefore={column.title}
            onPressEnter={(e) => {
              handleEnter(e, column.id)
              // change store "params" given title, e.target.value
            }}
          />
        ))
    );
  }, [props.tableColumns]);

  const handleEnter = (e, property_index) => {
    //property_list[property_index] will give us name of field
    let search = { fulltext_search: "" }
    //if there is a value to query based on
    if(e.target.value){
      search["property[" + property_index + "][joiner]"] = "and";
      search["property[" + property_index + "][property]"] = property_index;
      search["property[" + property_index + "][type]"] = "in";
      search["property[" + property_index + "][text]"] = e.target.value;


      console.log("params: ", search)

      //Seems jank, do not like this solution
      //props.query["params"] = search
      console.log(props.query)

      //TODO: props.query gives an error THIS would be a way better solution than above
      fetchSize(cookies.userInfo.host, "items", search).then((count) =>
      props.setQuery("items", search, count)
    );
    }
    
    
    



  }

  /* const onFinish = (values) => {
    let params = { fulltext_search: "" };
    if (values["property-list"]) {
      values["property-list"]
        .filter((each) => each !== undefined)
        .map((each, index) => {
          params["property[" + index + "][joiner]"] = each["joiner"];
          params["property[" + index + "][property]"] = each["property"];
          params["property[" + index + "][type]"] = each["type"];
          params["property[" + index + "][text]"] = each["key"];
          return each;
        });
    }
    if (values["project"]) {
      values["project"]
        .filter((each) => each !== undefined)
        .map((each, index) => {
          params["item_set_id[" + index + "]"] = each;
          return each;
        });
    }
    if (values["class"]) {
      values["class"]
        .filter((each) => each !== undefined)
        .map((each, index) => {
          params["resource_class_id[" + index + "]"] = each;
          return each;
        });
    }

    // START: cool zone
    fetchSize(cookies.userInfo.host, "items", params).then((count) =>
      props.setQuery("items", params, count)
    );
    // END: cool zone

    // searchItems(cookies.userInfo.host, params).then((response) => {
    //   let data = response.data.map((each) => ({
    //     ...each,
    //     key: each["o:id"],
    //   }));
    //   props.handleSearchResults(data);
    // });
  }; */

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
      <h1>Builder</h1>
    </>
  );
};

//export default QueryBuilder;
export default connect(mapStateToProps, {setQuery })(QueryBuilder)
