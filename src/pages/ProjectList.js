import React, { useState, useEffect } from "react";
import { Spin, Tree } from "antd";
import { getItemSetList, getItemsInItemSet } from "../utils/Utils";
import { useCookies } from "react-cookie";

const { DirectoryTree } = Tree;

function updateTreeData(list, key, children) {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }

    return node;
  });
}

const ProjectList = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    const loadProjectList = () => {
      getItemSetList(cookies.userInfo.host).then((response) => {
        setProjects(
          response.data.map((each) => ({
            key: each["o:id"],
            title: each["o:title"],
            isLeaf: false,
          }))
        );
      });
    };

    setLoading(true);
    loadProjectList();
  }, [cookies.userInfo]);

  useEffect(() => {
    setLoading(false);
  }, [projects]);

  const onLoadData = async (treeNode) => {
    const response = await getItemsInItemSet(
      cookies.userInfo.host,
      treeNode.key
    );
    let thisChildren = response.data.map((each) => ({
      key: treeNode.key + "-" + each["o:id"],
      title: each["o:title"],
      isLeaf: true,
    }));
    if (!thisChildren || thisChildren.length === 0) {
      return;
    }
    setProjects((projects) =>
      updateTreeData(projects, treeNode.key, thisChildren)
    );
  };
  //TODO
  const onSelect = (itemKey) => {
    // let itemId;
    // if (String(itemKey[0]).indexOf("-") !== -1) {
    //   itemId = itemKey[0].substring(
    //     itemKey[0].indexOf("-") + 1,
    //     itemKey[0].length
    //   );
    //   this.props.history.push("/items/" + itemId);
    // }
  };

  return loading ? (
    <div>
      <Spin tip="Loading..."></Spin>
    </div>
  ) : (
    <div className="project-list-container">
      <DirectoryTree
        blockNode={true}
        treeData={projects}
        loadData={onLoadData}
        onSelect={onSelect}
      />
    </div>
  );
};

export default ProjectList;
