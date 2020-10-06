import React from "react";
import QueryBuilder from "../components/QueryBuilder";
import { Layout, Tabs, Divider, Space } from "antd";

import {
  TableOutlined,
  VideoCameraAddOutlined,
  SearchOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import TableView from "../components/TableView";

const { TabPane } = Tabs;

const Explorer = (props) => {
  const tempTableColumns = [
    {
      title: "Id",
      dataIndex: "o:id",
      sorter: {
        compare: (a, b) => a["o:id"] - b["o:id"],
      },
      width: 100,
    },
    {
      title: "Title",
      dataIndex: "o:title",
      sorter: {
        compare: (a, b) => a["o:title"].localeCompare(b["o:title"]),
      },
      ellipsis: true,
      width: 200,
    },
  ];

  return (
    <div>
      <QueryBuilder />
      <Tabs defaultActiveKey={1}>
        <TabPane
          tab={
            <span>
              <TableOutlined />
              List
            </span>
          }
          key={1}
        >
          <TableView columns={tempTableColumns} />
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
    </div>
  );
};

export default Explorer;
