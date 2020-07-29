import React, { useState, useEffect } from "react";
import { Spin, Menu } from "antd";
import { getItemSetList, getItemsInItemSet } from "../utils/Utils";
import { useCookies } from "react-cookie";
import { withRouter } from "react-router-dom";

const { SubMenu } = Menu;
// TODO: if more than 2 projects contain a same item, there will be a bug
// handleClickItem
const ProjectList = (props) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    const loadProjectList = () => {
      getItemSetList(cookies.userInfo.host).then((response) => {
        let requests = response.data.map(async (each) => {
          const items = await getItemsInItemSet(
            cookies.userInfo.host,
            each["o:id"]
          );
          return {
            key: each["o:id"],
            title: each["o:title"],
            description: each["dcterms:description"]
              ? each["dcterms:description"][0]["@value"]
              : "",
            children: items.data,
          };
        });
        Promise.all(requests).then((values) => {
          setProjects(values);
        });
      });
    };

    setLoading(true);
    loadProjectList();
  }, [cookies.userInfo]);

  useEffect(() => {
    setLoading(false);
  }, [projects]);

  return loading ? (
    <div>
      <Spin tip="Loading..."></Spin>
    </div>
  ) : (
    <Menu
      onClick={({ item, key }) => {
        props.handleClickItem(key, item.props.title);
        return;
      }}
      selectable={false}
      mode="vertical"
    >
      {projects.map((project) => (
        <SubMenu key={project.key} title={project.title}>
          {project.children
            ? project.children.map((item) => (
                <Menu.Item
                  key={item["o:id"]}
                  title={
                    item["o:title"].substr(0, 20) +
                    (item["o:title"].length > 20 ? "..." : "")
                  }
                >
                  {item["o:title"].substr(0, 20) +
                    (item["o:title"].length > 20 ? "..." : "")}
                </Menu.Item>
              ))
            : null}
        </SubMenu>
      ))}
    </Menu>
  );
};

export default withRouter(ProjectList);
