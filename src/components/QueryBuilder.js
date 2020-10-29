import React, { useEffect, useState } from "react";
import { Select, Input, Table, Row, Col } from "antd";

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
  const [filters, setFilters] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  const [rows, setRows] = useState([]);

  const query = {};

  useEffect(() => {
    setRows(
      props.activeProperties.map((element) => (
        <Row gutter={[16, 16]}>
          <Col span={6}>{element["o:label"]}</Col>
          <Col span={18}>
            <Input
              style={{ width: "100%" }}
              key={"o:" + element["o:local_name"]}
              placeholder="press Enter to Query"
              onChange={(e) => {
                handleFilterChange(e, element["o:id"]);
              }}
              onPressEnter={(e) => {
                handleEnter(e, element["o:id"]);
              }}
            />
          </Col>
        </Row>
      ))
    );
  }, [props.activeProperties]);

  const handleFilterChange = (e, property_index) => {
    query[property_index] = e.target.value;
  };

  const handleEnter = (e, property_index) => {
    //property_list[property_index] will give us name of field

    let search = { fulltext_search: "" };
    let counter = 0;

    props.activeProperties.map((element) => {
      if (query[element["o:id"]]) {
        search["property[" + counter + "][joiner]"] = "and";
        search["property[" + counter + "][property]"] = element["o:id"];
        search["property[" + counter + "][type]"] = "in";
        search["property[" + counter + "][text]"] = query[element["o:id"]];

        counter += 1;
      }
    });

    fetchSize(cookies.userInfo.host, "items", search).then((count) =>
      props.setQuery("items", search, count)
    );
  };

  // Return a table object where each row is a field, the first column is the name
  // of the field and the second column is the value being queried
  return <>{rows}</>;
};

//export default QueryBuilder;
export default connect(mapStateToProps, { setQuery })(QueryBuilder);
