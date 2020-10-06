import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { fetch } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const TableView = (props) => {
  const [tabelState, setTableState] = useState({
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: props.query.size,
    },
    loading: false,
  });

  const [cookies] = useCookies(["userInfo"]);

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
    setTableState({
      ...tabelState,
      loading: true,
    });

    fetch(
      cookies.userInfo.host,
      props.query.endpoint,
      props.query.params,
      pagination.current * pagination.pageSize,
      pagination.pageSize
    ).then((res) => {
      setTableState({
        ...tabelState,
        pagination,
        loading: false,
        data: res,
      });
    });
  };

  return (
    <Table
      bordered
      //   rowSelection={rowSelection}
      //   components={components}
      columns={props.columns}
      //   expandable={{
      //     expandedRowRender:
      //       props.hasMediaData === true ? expandedRowRender : null,
      //   }}
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
