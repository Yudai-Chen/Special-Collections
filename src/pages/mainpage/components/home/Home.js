import React, { Component } from "react";
import { Layout, Tabs, Divider } from "antd";
import Preview from "../preview/Preview";
import Datalist from "../dataList/DataList";
import Filmstrip from "../filmstrip/Filmstrip";
import Metadata from "../../../../components/metadata/Metadata";
import Archive from "../archive/Archive";

import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

export default class MainContent extends Component {
  state = {
    selectedFiles: [],
    rowRecord: {},
    projects: [],
  };

  getSelectedFiles = (files) => {
    this.setState({ selectedFiles: files });
  };

  onRowClick = (record) => {
    this.setState({ rowRecord: record });
  };

  onCreateProject = (project) => {
    let data = this.state.projects;
    data.push(project);
    this.setState({ projects: data });
  };

  onUpdateProjects = (newProjects) => {
    this.setState({ projects: newProjects });
  };

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
          <Archive updateSelectedFiles={this.getSelectedFiles} />
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
        <Sider theme="light" collapsible={false}>
          <Preview target={this.state.rowRecord} />
          <Divider style={{ height: "20" }} />
          <Metadata target={this.state.rowRecord} />
        </Sider>
      </Layout>
    </Layout>
  );
}
