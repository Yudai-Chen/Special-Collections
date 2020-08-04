import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { MainpageRouter } from "../route/Routers";
import { withRouter } from "react-router-dom";
import {
  FolderOutlined,
  FolderAddOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { PATH_PREFIX, Logo } from "../utils/Utils";
import { Link } from "react-router-dom";

const { Header } = Layout;

const MainPage = () => {
  const [current, setCurrent] = useState("home");

  return (
    <Layout>
      <Header
        style={{ background: "#FFF", height: "13vh", position: "relative" }}
      >
        <div className="logo">
          <div
            style={{
              float: "left",
              position: "absolute",
              bottom: 10,
            }}
          >
            <img src={Logo} alt="logo.png" width="100" height="100" />
          </div>
          <div
            style={{
              left: "180px",
              position: "absolute",
              bottom: 24,
            }}
          >
            <h1
              style={{
                "font-family": "Goudy Old Style",
                "font-style": "italic",
                "font-weight": "bolder",
                "line-height": "26.4px",
                color: "#093eba",
                "font-size": "36px",
              }}
            >
              SPECIAL COLLECTIONS
            </h1>
          </div>
          <div
            style={{
              float: "right",
            }}
          >
            <a
              href="https://github.com/Yudai-Chen/Special-Collections/"
              target="_blank"
            >
              <LinkOutlined /> Learn More
            </a>
          </div>
        </div>
      </Header>
      <div style={{ height: "1px" }} />
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
