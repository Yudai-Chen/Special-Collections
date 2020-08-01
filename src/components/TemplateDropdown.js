import React, { useState, useEffect } from "react";
import { Menu, Spin, Dropdown } from "antd";
import { getResourceTemplateList } from "../utils/Utils";
import { useCookies } from "react-cookie";
import { DownOutlined } from "@ant-design/icons";

// onMenuSelect
const TemplateDropdown = (props) => {
  const [loading, setLoading] = useState(true);
  const [templateList, setTemplateList] = useState([]);
  const [cookies] = useCookies(["userInfo"]);
  const [menuSelected, setMenuSelected] = useState({
    "o:label": "Select A Template",
  });

  const onMenuClick = ({ key }) => {
    try {
      let template = templateList.filter((each) => each["o:id"] == key);
      setMenuSelected(template[0]);
      props.onMenuSelect(template[0][["o:id"]]);
    } catch (error) {}
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      {loading ? (
        <Spin></Spin>
      ) : (
        templateList.map((each) => (
          <Menu.Item key={each["o:id"]}>{each["o:label"]}</Menu.Item>
        ))
      )}
    </Menu>
  );

  useEffect(() => {
    setLoading(true);
    getResourceTemplateList(cookies.userInfo.host).then((response) => {
      setTemplateList([
        { "o:label": "ALL Properties", "o:id": 0 },
        ...response.data,
      ]);
    });
  }, [cookies.userInfo]);

  useEffect(() => {
    setLoading(false);
  }, [templateList]);

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {menuSelected["o:label"]} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default TemplateDropdown;
