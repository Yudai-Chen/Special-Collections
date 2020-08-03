import React, { useState, useEffect } from "react";
import { Menu, Spin, Dropdown } from "antd";
import { getItemSetList } from "../utils/Utils";
import { useCookies } from "react-cookie";
import { DownOutlined } from "@ant-design/icons";

// onMenuSelect
const ProjectDropdown = (props) => {
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [cookies] = useCookies(["userInfo"]);
  const [menuSelected, setMenuSelected] = useState({
    "o:title": "Select A Project",
  });

  const onMenuClick = ({ key }) => {
    try {
      let project = projectList.filter((each) => String(each["o:id"]) === key);
      setMenuSelected(project[0]);
      props.onMenuSelect(project[0][["o:id"]]);
    } catch (error) {}
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      {loading ? (
        <Spin></Spin>
      ) : (
        projectList.map((each) => (
          <Menu.Item key={each["o:id"]}>
            {each["o:title"] ? each["o:title"] : "[Untitled]"}
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  useEffect(() => {
    setLoading(true);
    getItemSetList(cookies.userInfo.host).then((response) => {
      setProjectList(response.data);
    });
  }, [cookies.userInfo]);

  useEffect(() => {
    setLoading(false);
  }, [projectList]);

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {menuSelected["o:title"] ? menuSelected["o:title"] : "[Untitled]"}
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default ProjectDropdown;
