import React, { useState } from "react";
import { Button, Table, Space, Pagination, Tag } from "antd";
import { withRouter, Link } from "react-router-dom";
import NewProjectModal from "./NewProjectModal";
import AddToProjectModal from "./AddToProjectModal";
import AddNoteButton from "./AddNoteButton";
import PropertyListMenu from "./PropertyListMenu";
import PropertyValue from "./PropertyValue";
import { PATH_PREFIX, PlaceHolder } from "../utils/Utils";

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
};

// hasMediaData, dataSource, handleRowClick, loading
const DataList = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalsVisible, setModalsVisible] = useState(0);
  const defaultProperties = [
    idProperty,
    titleProperty,
    typeProperty,
    viewProperty,
  ];
  const defaultColumns = [idColumn, titleColumn, typeColumn, viewColumn];
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
              alt={record["o:title"]}
              width="20px"
            />
          ) : (
            <img src={PlaceHolder} alt="PlaceHolder" width="20px" />
          ),
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
        });
      }
      return each;
    });
    setColumns(newColumns);
  };

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <PropertyListMenu
          extraProperties={extraProperties}
          handleChange={onPropertyChange}
          defaultProperties={defaultProperties}
        />
        <Table
          loading={props.loading}
          onRow={(record) => {
            return {
              onClick: (event) => {
                props.handleRowClick(record);
              },
            };
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={props.dataSource}
          expandable={{
            expandedRowRender:
              props.hasMediaData === true ? expandedRowRender : null,
          }}
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

export default withRouter(DataList);
