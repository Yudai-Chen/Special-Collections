import React, { Component } from "react";
import { Layout } from "antd";
import { Route } from "react-router-dom";
import ProjectList from "./ProjectList";
import Item from "./Item";

const { Sider, Content } = Layout;

export default class ProjectsPage extends Component {
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
          <ProjectList />
        </Sider>
        <Layout>
          <Content>
            <Route path="/items/:itemId" component={Item} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
