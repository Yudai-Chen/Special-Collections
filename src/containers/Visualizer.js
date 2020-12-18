import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import TableView from "../components/TableView";
import CardView from "../components/CardView";

const { TabPane } = Tabs;

const Visualizer = (props) => {
  return (
    <Tabs defaultActiveKey={1} type="card">
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
        <CardView activeProperties={props.activeProperties} />
      </TabPane>
    </Tabs>
  );
};

export default Visualizer;
