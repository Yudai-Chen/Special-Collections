import React from "react";
import QueryBuilder from "../components/QueryBuilder";
import { Layout, Tabs, Divider, Space } from "antd";

import {
  TableOutlined,
  VideoCameraAddOutlined,
  SearchOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

const Explorer = (props) => {
  // Tag bar
  // Filterer
  // Tabs
  // -- Table
  // -- Cards
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
          <h1>Table</h1>
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
