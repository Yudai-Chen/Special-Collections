import React, { useState } from "react";
import QueryBuilder from "../components/QueryBuilder";
import { Layout, Tabs, Divider, Space } from "antd";

import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import TableView from "../components/TableView";

const { TabPane } = Tabs;

const Explorer = (props) => {
  const [tableColumns, setTableColumns] = useState([
    {
      title: "ID",
      dataIndex: "o:id",
      sorter: {
        compare: (a, b) => (a["o:id"] ?? 0) - (b["o:id"] ?? 0),
      },
      width: 100,
      active: true,
    },
    {
      title: "Title",
      dataIndex: "o:title",
      sorter: {
        compare: (a, b) =>
          (a["o:title"] ?? "").localeCompare(b["o:title"] ?? ""),
      },
      ellipsis: true,
      width: 200,
      active: true,
    },
  ]);

  return (
    <>
      <QueryBuilder
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
      />
      <Tabs defaultActiveKey={1}>
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Table
            </span>
          }
          key={1}
        >
          <TableView
            columns={tableColumns.filter((col) => col.active === true)}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <VideoCameraAddOutlined />
              Card
            </span>
          }
          key={2}
        >
          <h1>Cards</h1>
        </TabPane>
      </Tabs>
    </>
  );
};

export default Explorer;
