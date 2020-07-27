import React, { useState } from "react";
import { Button, Table, Space, Pagination, Tag } from "antd";
import { withRouter, Link } from "react-router-dom";
import NewProjectModal from "./NewProjectModal";
import AddToProjectModal from "./AddToProjectModal";
import AddNoteButton from "./AddNoteButton";
import PropertyListMenu from "./PropertyListMenu";
import PropertyValue from "./PropertyValue";
import { PATH_PREFIX } from "../utils/Utils";

const typeProperty = {
  "o:label": "Class",
  "o:term": "@type",
};

const typeColumn = {
  title: "Class",
  dataIndex: "@type",
  render: (text, record) => (record["@type"][1] ? record["@type"][1] : null),
  sorter: {
    compare: (a, b) => {
      let value1 = a["@type"][1] ? a["@type"][1] : "";
      let value2 = b["@type"][1] ? b["@type"][1] : "";
      return value1 - value2;
    },
  },
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
  "o:label": "ItemId",
  "o:term": "o:id",
};

const idColumn = {
  title: "ItemId",
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
      <Link to={PATH_PREFIX + "/admin/items/" + record["o:id"]} target="_blank">
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
  const defaultProperties = [idProperty, viewProperty, typeProperty];
  const defaultColumns = [idColumn, viewColumn, typeColumn];
  const extraProperties = [
    idProperty,
    viewProperty,
    createdProperty,
    typeProperty,
    itemSetProperty,
  ];
  const extraColumns = [
    idColumn,
    viewColumn,
    createdColumn,
    typeColumn,
    itemSetColumn,
  ];
  const [columns, setColumns] = useState(defaultColumns);

  const expandedRowRender = (record) => {
    const innerColumns = [
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (record) => <img src={record} width="20px" alt="" />,
      },
      { title: "Media Id", dataIndex: "mediaId", key: "mediaId" },
      { title: "Media Title", dataIndex: "mediaTitle", key: "mediaTitle" },
      {
        title: "Transcript",
        dataIndex: "transcript",
        key: "transcript",
        ellipsis: true,
      },
      {
        title: "View",
        dataIndex: "view",
        render: (text, record) => (
          <Space size="middle">
            <Link to={"/media/" + record.mediaId} target="_blank">
              View
            </Link>
          </Space>
        ),
      },
    ];
    return (
      <Table
        columns={innerColumns}
        dataSource={record["media"]}
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
            <AddNoteButton />
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
