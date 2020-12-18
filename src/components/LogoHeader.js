import React from "react";
import { Layout } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { Logo, PATH_PREFIX } from "../utils/Utils";
import { Link } from "react-router-dom";
const { Header } = Layout;

const LogoHeader = () => {
  return (
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
          <Link to={PATH_PREFIX + "/admin/home"}>
            <img src={Logo} alt="logo.png" width="100" height="100" />
          </Link>
        </div>
        <div
          style={{
            left: "180px",
            position: "absolute",
            bottom: 24,
          }}
        >
          <Link to={PATH_PREFIX + "/admin/home"}>
            <h1
              style={{
                fontFamily: "Goudy Old Style",
                fontStyle: "italic",
                fontWeight: "bolder",
                lineHeight: "26.4px",
                color: "#093eba",
                fontSize: "36px",
              }}
            >
              SPECIAL COLLECTIONS
            </h1>
          </Link>
        </div>
        <div
          style={{
            float: "right",
          }}
        >
          <a
            href="https://github.com/Yudai-Chen/Special-Collections/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkOutlined /> Learn More
          </a>
        </div>
      </div>
    </Header>
  );
};

export default LogoHeader;
