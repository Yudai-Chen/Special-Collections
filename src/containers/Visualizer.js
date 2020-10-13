import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import TableView from "../components/TableView";

const { TabPane } = Tabs;

const Visualizer = (props) => {
  return (
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
        <TableView activeProperties={props.activeProperties} />
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
  );
};

export default Visualizer;
