import React, { Component } from "react";
import { Layout, Tabs, Divider } from "antd";
import Archive from "./components/archive/Archive";
import Preview from "./components/preview/Preview";
import Datalist from "./components/dataList/DataList";
import Metadata from "./components/metadata/Metadata";
import Filmstrip from "./components/filmstrip/Filmstrip";
import Project from "./components/project/Project";
import ProjectList from "./components/projectList/ProjectList";
import {
  FolderOutlined,
  FolderAddOutlined,
  TableOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const logo = require("./1.png");

export default class MainPage extends Component {
  state = {
    selectedFiles: [],
    rowRecord: {},
    tabState: "1",
    project: [],
    selectedProjectKeys: undefined,
  };
  getSelectedFiles = (files) => {
    this.setState({ selectedFiles: files });
  };

  onTabChange = (activeKey) => {
    this.setState({ tabState: activeKey });
  };

  onRowClick = (record) => {
    this.setState({ rowRecord: record });
  };

  onCreateProject = (project) => {
    this.setState({ project: project });
  };

  onProjectListSelect = (selectedKeys) => {
    this.setState({ selectedProjectKeys: selectedKeys });
  };

  render() {
    let files = this.state.selectedFiles;
    let content =
      this.state.tabState === "1" ? (
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
                  shownFiles={files}
                  handleRowClick={this.onRowClick}
                  handleCreateProject={this.onCreateProject}
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
                <Filmstrip shownFiles={files} />
              </TabPane>
            </Tabs>
          </Content>
          <Sider theme="light" collapsible={false}>
            <Preview target={this.state.rowRecord} />
            <Divider style={{ height: "20" }} />
            <Metadata target={this.state.rowRecord} />
          </Sider>
        </Layout>
      ) : (
        <Layout>
          <Content>
            <div className="container">
              <Project shownFile={this.state.selectedProjectKeys} />
            </div>
          </Content>
        </Layout>
      );
    return (
      <Layout>
        <Header>
          <div className="logo">
            <img src={logo} alt="logo.png" width="200" height="50" />
          </div>
        </Header>
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
            <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
              <TabPane
                tab={
                  <span>
                    <FolderOutlined />
                    Folder
                  </span>
                }
                key="1"
              >
                <div>
                  <Archive
                    updateSelectedFiles={this.getSelectedFiles}
                    handleExpand={this.getSelectedFiles}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <FolderAddOutlined />
                    Project
                  </span>
                }
                key="2"
              >
                <ProjectList
                  project={this.state.project}
                  onProjectListSelect={this.onProjectListSelect}
                />
              </TabPane>
            </Tabs>
          </Sider>
          {content}
        </Layout>
      </Layout>
    );
  }
}
