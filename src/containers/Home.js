import React, { useState } from "react";
import { Layout, Tabs, Divider } from "antd";
import Preview from "../pages/Preview";
import Datalist from "../pages/DataList";
import Filmstrip from "../pages/Filmstrip";
import Metadata from "../pages/Metadata";
import Archive from "../pages/Archive";
import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [rowRecord, setRowRecord] = useState({});

  render = () => (
    <Layout>
      <Sider
        style={{
          overflow: "scroll",
          minHeight: "100vh",
          width: "20vw",
          left: 0,
        }}
        theme="light"
      >
        <div>
          <Archive updateSelectedFiles={(files) => {
            setSelectedFiles(files);
          }} />
        </div>
      </Sider>
      <Layout>
        <Content>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <TableOutlined />
                  List
                </span>
              }
              key="1"
            >
              <Datalist
                shownFiles={selectedFiles}
                handleRowClick={(record) => {
                  setRowRecord(record);
                }}
                type={false}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <VideoCameraAddOutlined />
                  Filmstrip
                </span>
              }
              key="2"
            >
              <Filmstrip shownFiles={selectedFiles} />
            </TabPane>
          </Tabs>
        </Content>
        <Sider theme="light" collapsible={false}>
          <Preview target={rowRecord} />
          <Divider style={{ height: "20" }} />
          <Metadata target={rowRecord} />
        </Sider>
      </Layout>
    </Layout>
  );
}

export default Home;
