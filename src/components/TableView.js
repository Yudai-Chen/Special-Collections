import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { fetch } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const TableView = (props) => {
  const [cookies] = useCookies(["userInfo"]);

  const [tableState, setTableState] = useState({
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: props.query.size,
    },
    loading: false,
  });

  useEffect(() => {
    const fetchInitial = async () => {
      setTableState((state) => ({
        ...state,
        loading: true,
      }));

      const data = await fetch(
        cookies.userInfo.host,
        props.query.endpoint,
        props.query.params,
        0,
        10
      );

      setTableState((state) => ({
        ...state,
        data,
        loading: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: props.query.size,
        },
      }));
    };

    fetchInitial();
  }, [props.query, cookies.userInfo.host]);

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const cols = props.activeProperties.map((property) => ({
      title: property["o:label"],
      dataIndex: property["o:term"],
      key: property["o:term"],
      sorter: {
        compare: (a, b) => a > b, // TODO: May need to change for different data types
      },
      render: (value, _row, _index) => {
        if (value && value.length > 0 && value[0].type === "literal") {
          return value[0]["@value"];
        }

        return "";
      },
    }));
    setColumns(cols);
  }, [props.activeProperties]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableState({
      ...tableState,
      loading: true,
    });

    fetch(
      cookies.userInfo.host,
      props.query.endpoint,
      props.query.params,
      (pagination.current - 1) * pagination.pageSize,
      pagination.pageSize,
      sorter.field ? sorter.field.slice(2) : "id", // remove leading 'o:'
      sorter.order === "descend" ? "desc" : "asc"
    ).then((res) => {
      setTableState({
        ...tableState,
        pagination,
        sorter,
        loading: false,
        data: res,
      });
    });
  };

  const idColumn = {
    title: "ID",
    dataIndex: "o:id",
    key: "id",
  };

  return (
    <Table
      bordered
      rowSelection
      columns={columns}
      loading={tableState.loading}
      dataSource={tableState.data}
      onChange={handleTableChange}
      pagination={tableState.pagination}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    ...props,
    query: state.query,
  };
};

export default connect(mapStateToProps)(TableView);
