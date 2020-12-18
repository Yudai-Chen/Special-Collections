import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetch } from "../utils/OmekaS";
import { useCookies } from "react-cookie";
import NewProjectModal from "./NewProjectModal";
import AddToProjectModal from "./AddToProjectModal";
import AddNoteButton from "./AddNoteButton";
import { PATH_PREFIX, PlaceHolder } from "../utils/Utils";

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
    selectedRowKeys: [],
  });

  const [modalsVisible, setModalsVisible] = useState(0);

  useEffect(() => {
    const fetchInitial = async () => {
      setTableState((state) => ({
        ...state,
        loading: true,
      }));

      const data = await fetch(
        cookies.userInfo.host,
        props.query.endpoint,
        props.query.item_set_id,
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
        if (value && value.length > 0) {
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
      props.query.item_set_id,
      props.query.params,
      (pagination.current - 1) * pagination.pageSize,
      pagination.pageSize,
      sorter.field ?? "id",
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

  const typeColumn = {
    title: "Omeka-S Type",
    dataIndex: "@type",
    key: "type",
    render: (value, _row, _index) => {
      const str = value[value.length - 1];
      const n = str.lastIndexOf(":");
      return str.substring(n + 1);
    },
  };

  const viewColumn = {
    title: "View",
    dataIndex: "View",
    render: (text, record) => (
      <Space size="middle">
        <Link to={PATH_PREFIX + "/items/" + record["o:id"]} target="_blank">
          View
        </Link>
      </Space>
    ),
    width: 100,
  };

  const thumbnailColumn = {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    render: (text, record) => (
      <img width={80} height = {80} alt="" src={record["thumbnail_display_urls"]["square"] ? record["thumbnail_display_urls"]["square"] : PlaceHolder}></img>
    ),
    width: 100,
  };

  return (
    <>
      <Table
        bordered
        ellipsis={true}
        columns={[viewColumn, thumbnailColumn].concat(columns)}
        loading={tableState.loading}
        dataSource={tableState.data}
        onChange={handleTableChange}
        pagination={tableState.pagination}
        rowSelection={{
          selectedRowKeys: tableState.selectedRowKeys,
          onChange: (selectedRowKeys) =>
            setTableState({ ...tableState, selectedRowKeys }),
        }}
        scroll={{ x: 5000 }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ margin: "5px" }}>
          <AddNoteButton targets={tableState.selectedRowKeys} />
        </div>
        <div style={{ margin: "5px" }}>
          <Button onClick={() => setModalsVisible(2)}>Add To Project</Button>
        </div>
        <div style={{ margin: "5px" }}>
          <Button type="primary" onClick={() => setModalsVisible(1)}>
            Create Project
          </Button>
        </div>
      </div>
      <NewProjectModal
        visible={modalsVisible === 1}
        selectedRowKeys={tableState.selectedRowKeys}
        onClose={() => setModalsVisible(0)}
      />
      <AddToProjectModal
        visible={modalsVisible === 2}
        selectedRowKeys={tableState.selectedRowKeys}
        onClose={() => setModalsVisible(0)}
      />
      {/* </Space> */}
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    ...props,
    query: state.query,
  };
};

export default connect(mapStateToProps)(TableView);
