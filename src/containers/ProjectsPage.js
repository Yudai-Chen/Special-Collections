import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import ProjectList from "../components/ProjectList";
import "antd/dist/antd.css";
import ItemView from "./ItemView";

const { TabPane } = Tabs;
const { Sider, Content } = Layout;

const ProjectsPage = () => {
  const [display, setDisplay] = useState([]);
  const [activeKey, setActiveKey] = useState(0);
  const onClickItem = (itemId, itemTitle) => {
    if (display.filter((each) => each.key === itemId).length === 0) {
      setDisplay((display) => {
        display.push({ key: itemId, title: itemTitle });
        return display;
      });
    }
    setActiveKey(itemId);
  };

  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex;
    display.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = display.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setDisplay(newPanes);
    setActiveKey(newActiveKey);
  };

  return (
    <Layout style={{ background: "#fff" }}>
      <Sider
        style={{
          overflow: "scroll",
          minHeight: "100vh",
          width: "20vw",
          left: 0,
        }}
        theme="light"
      >
        <ProjectList handleClickItem={onClickItem} />
      </Sider>
      <Content>
        <Tabs
          hideAdd
          onChange={(activeKey) => setActiveKey(activeKey)}
          activeKey={activeKey}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === "remove") {
              remove(targetKey);
            }
          }}
        >
          {display.map((pane) => (
            <TabPane tab={pane.title} key={pane.key}>
              <ItemView itemId={pane.key} />
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  );
};

export default ProjectsPage;
