import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { fetch } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const TableView = (props) => {
  const [cookies] = useCookies(["userInfo"]);

  const [tabelState, setTableState] = useState({
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

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(sorter);
    setTableState({
      ...tabelState,
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
        ...tabelState,
        pagination,
        sorter,
        loading: false,
        data: res,
      });
    });
  };

  return (
    <Table
      bordered
      rowSelection
      columns={props.columns}
      loading={tabelState.loading}
      dataSource={tabelState.data}
      onChange={handleTableChange}
      pagination={tabelState.pagination}
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
