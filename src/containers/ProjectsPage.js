import React from "react";
import { Layout } from "antd";
import ProjectList from "../pages/ProjectList";
import { ProjectpageRouter } from "../route/Routers";

const { Sider, Content } = Layout;

const ProjectsPage = () => {
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
      <Content>
        <ProjectpageRouter />
      </Content>
    </Layout>
  );
};

export default ProjectsPage;
