import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { MainpageRouter } from "../route/Routers";
import { withRouter } from "react-router-dom";
import { FolderOutlined, FolderAddOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { PATH_PREFIX, Logo } from "../utils/Utils";
import { Link } from "react-router-dom";

const { Header } = Layout;

const MainPage = () => {
  const [current, setCurrent] = useState("home");

  return (
    <Layout>
      <Header>
        <div className="logo">
          <img src={Logo} alt="logo.png" width="200" height="50" />
        </div>
      </Header>
      <Menu
        onClick={(e) => {
          setCurrent(e.key);
        }}
        selectedKeys={[current]}
        mode="horizontal"
      >
        <Menu.Item key="home" icon={<FolderOutlined />}>
          <Link to={PATH_PREFIX + "/admin/home"}>Archive</Link>
        </Menu.Item>
        <Menu.Item key="projects" icon={<FolderAddOutlined />}>
          <Link to={PATH_PREFIX + "/admin/items"}>Projects</Link>
        </Menu.Item>
      </Menu>
      <MainpageRouter />
    </Layout>
  );
};

export default withRouter(MainPage);
