import React, { useEffect, useState } from "react";
import { Button, Table, Space, Pagination, Tag } from "antd";
import { Resizable } from "react-resizable";
import { withRouter, Link } from "react-router-dom";
import NewProjectModal from "./NewProjectModal";
import AddToProjectModal from "./AddToProjectModal";
import AddNoteButton from "./AddNoteButton";
import PropertyListMenu from "./PropertyListMenu";
import PropertyValue from "./PropertyValue";
import { PATH_PREFIX, PlaceHolder } from "../utils/Utils";
import "./DataList.css";
import { connect } from "react-redux";
import { fetch } from "../utils/OmekaS";
import { useCookies } from "react-cookie";

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const components = {
  header: {
    cell: ResizableTitle,
  },
};

const typeProperty = {
  "o:label": "Class",
  "o:term": "@type",
};

const typeColumn = {
  title: "Class",
  dataIndex: "@type",
  render: (text, record) =>
    Array.isArray(record["@type"]) && record["@type"][1]
      ? record["@type"][1]
      : null,
  sorter: {
    compare: (a, b) => {
      let value1 =
        Array.isArray(a["@type"]) && a["@type"][1] ? a["@type"][1] : "";
      let value2 =
        Array.isArray(b["@type"]) && b["@type"][1] ? b["@type"][1] : "";
      return value1 - value2;
    },
  },
  width: 200,
};

const titleProperty = {
  "o:label": "Title",
  "o:term": "o:title",
};

const titleColumn = {
  title: "Title",
  dataIndex: "o:title",
  sorter: {
    compare: (a, b) => a["o:title"].localeCompare(b["o:title"]),
  },
  ellipsis: true,
  width: 200,
};

const recordYearProperty = {
  "o:label": "Record Year(s)",
  "o:term": "acm5:year",
};

const recordYearColumn = {
  title: "Record Year(s)",
  dataIndex: "acm5:year",
  render: (text, record) =>
    record["acm5:year"] ? <PropertyValue values={record["acm5:year"]} /> : null,
  sorter: {
    compare: (a, b) => {
      if (
        a["acm5:year"] &&
        a["acm5:year"][0] &&
        a["acm5:year"][0].type === "literal" &&
        b["acm5:year"] &&
        b["acm5:year"][0] &&
        b["acm5:year"][0].type === "literal"
      )
        return a["acm5:year"][0]["@value"].localeCompare(
          b["acm5:year"][0]["@value"]
        );
      else return 0;
    },
  },
  width: 200,
};

const itemSetProperty = {
  "o:label": "Projects",
  "o:term": "o:item_set",
};

const itemSetColumn = {
  title: "Projects",
  dataIndex: "o:item_set",
  render: (text, record) =>
    !record["o:item_set"] ? null : (
      <Space size="middle">
        {record["o:item_set"].map((each) => (
          <Tag color="blue">
            <Link to={PATH_PREFIX + "/projects/" + each["o:id"]}>
              {each["o:id"]}
            </Link>
          </Tag>
        ))}
      </Space>
    ),
  sorter: {
    compare: (a, b) => {
      let str1 = a["o:item_set"].toString();
      let str2 = b["o:item_set"].toString();
      return str1.localeCompare(str2);
    },
  },
  width: 200,
};

const idProperty = {
  "o:label": "Id",
  "o:term": "o:id",
};

const idColumn = {
  title: "Id",
  dataIndex: "o:id",
  sorter: {
    compare: (a, b) => a["o:id"] - b["o:id"],
  },
  width: 100,
};

const viewProperty = {
  "o:label": "View",
  "o:term": "view",
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

const createdProperty = {
  "o:label": "Created",
  "o:term": "o:created",
};

const createdColumn = {
  title: "Created",
  dataIndex: "o:created",
  render: (text, record) => record["o:created"]["@value"],
  sorter: {
    compare: (a, b) => {
      let date1 = Date.parse(a["o:created"]["@value"]);
      let date2 = Date.parse(b["o:created"]["@value"]);
      return date1 - date2;
    },
  },
  width: 200,
};

// hasMediaData, dataSource, handleRowClick, loading, selectedProperties
const DataList = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalsVisible, setModalsVisible] = useState(0);
  const defaultProperties = [
    titleProperty,
    typeProperty,
    recordYearProperty,
    viewProperty,
  ];
  const defaultColumns = [
    titleColumn,
    typeColumn,
    recordYearColumn,
    viewColumn,
  ];
  const extraProperties = [
    idProperty,
    titleProperty,
    viewProperty,
    createdProperty,
    typeProperty,
    itemSetProperty,
  ];
  const extraColumns = [
    idColumn,
    titleColumn,
    viewColumn,
    createdColumn,
    typeColumn,
    itemSetColumn,
  ];
  const [columns, setColumns] = useState(defaultColumns);

  const expandedRowRender = (record) => {
    const innerColumns = [
      idColumn,
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        render: (text, record) =>
          record["o:thumbnail_urls"] ? (
            <img
              src={record["o:thumbnail_urls"]["square"]}
              alt={record["o:title"] ? record["o:title"] : "[Untitled]"}
              width="20px"
            />
          ) : (
            <img src={PlaceHolder} alt="PlaceHolder" width="20px" />
          ),
        width: 120,
      },
      titleColumn,
      {
        title: "Transcript",
        dataIndex: "transcript",
        render: (text, record) => record["bibo:transcriptOf"][0]["@value"],
        ellipsis: true,
      },
      {
        title: "View",
        dataIndex: "view",
        render: (text, record) => (
          <Space size="middle">
            <Link
              to={PATH_PREFIX + "/media/" + JSON.stringify([record["o:id"]])}
              target="_blank"
            >
              View
            </Link>
          </Space>
        ),
        width: 100,
      },
    ];
    return (
      <Table
        columns={innerColumns}
        dataSource={record.media}
        pagination={<Pagination size="small" />}
      />
    );
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
  };

  const onPropertyChange = (values) => {
    let newColumns = [];
    values.map((each) => {
      let found = false;
      extraProperties.forEach((extra, i) => {
        if (extra["o:term"] === each) {
          newColumns.push(extraColumns[i]);
          found = true;
        }
      });
      if (!found) {
        newColumns.push({
          title: each,
          dataIndex: each,
          render: (text, record) =>
            record[each] ? <PropertyValue values={record[each]} /> : null,
          sorter: {
            compare: (a, b) => {
              if (
                a[each] &&
                a[each][0] &&
                a[each][0].type === "literal" &&
                b[each] &&
                b[each][0] &&
                b[each][0].type === "literal"
              )
                return a[each][0]["@value"].localeCompare(b[each][0]["@value"]);
              else return 0;
            },
          },
          width: 200,
        });
      }
      return each;
    });
    setColumns(newColumns);
  };

  const handleResize = (index) => (e, { size }) => {
    setColumns((columns) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };

  const resizableColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  // START: cool zone
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
      setTableState({
        ...tabelState,
        loading: true,
      });

      const data = await fetch(
        cookies.userInfo.host,
        props.query.endpoint,
        props.query.params,
        0,
        10
      );

      setTableState({
        ...tabelState,
        data,
        loading: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: props.query.size,
        },
      });
    };
    fetchInitial();
  }, [props.query]);

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
  // END: cool zone

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <PropertyListMenu
          originalProperties={props.selectedProperties}
          extraProperties={extraProperties}
          handleChange={onPropertyChange}
          defaultProperties={defaultProperties}
        />

        <Table
          bordered
          loading={tabelState.loading}
          onRow={(record) => {
            return {
              onClick: (event) => {
                props.handleRowClick(record);
              },
            };
          }}
          rowSelection={rowSelection}
          components={components}
          columns={resizableColumns}
          dataSource={tabelState.data}
          expandable={{
            expandedRowRender:
              props.hasMediaData === true ? expandedRowRender : null,
          }}
          onChange={handleTableChange}
          pagination={tabelState.pagination}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ margin: "5px" }}>
            <AddNoteButton targets={selectedRowKeys} />
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
          selectedRowKeys={selectedRowKeys}
          onClose={() => setModalsVisible(0)}
        />
        <AddToProjectModal
          visible={modalsVisible === 2}
          selectedRowKeys={selectedRowKeys}
          onClose={() => setModalsVisible(0)}
        />
      </Space>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    ...props,
    query: state.query,
  };
};

export default connect(mapStateToProps)(withRouter(DataList));
