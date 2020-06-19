import React, { Component } from "react";
import { Layout, Tabs } from "antd";
import Datalist from "../dataList/DataList";
import Filmstrip from "../filmstrip/Filmstrip";
import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

export default class MainPage extends Component {
  state = {};

  render() {
    return (
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
          <div></div>
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
                  shownFiles={this.state.selectedFiles}
                  projects={this.state.projects}
                  handleRowClick={this.onRowClick}
                  handleCreateProject={this.onCreateProject}
                  updataProjects={this.onUpdateProjects}
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
                <Filmstrip shownFiles={this.state.selectedFiles} />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
