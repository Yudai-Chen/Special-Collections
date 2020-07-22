import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { MainpageRouter } from "../route/Routers";
import {
  FolderOutlined,
  FolderAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
          <Link to={PATH_PREFIX + "/home"}>Home</Link>
        </Menu.Item>
        <Menu.Item key="search" icon={<SearchOutlined />}>
          <Link to={PATH_PREFIX + "/search"}>Search</Link>
        </Menu.Item>
        <Menu.Item key="projects" icon={<FolderAddOutlined />}>
          <Link to={PATH_PREFIX + "/items"}>Projects</Link>
        </Menu.Item>
      </Menu>
      <MainpageRouter />
    </Layout>
  );
}

export default MainPage;
