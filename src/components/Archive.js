import React, { useState } from "react";
import { Input, Tree, Button, Modal, Space } from "antd";
import { getItem } from "../utils/Utils";
import { useCookies } from "react-cookie";
import "antd/dist/antd.css";

const { DirectoryTree } = Tree;

const updateTreeData = (list, key, children) => {
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
};

const makeTreeNodeLeaf = (list, key) => {
  return list.map((node) => {
    if (node.key === key) {
      node.isLeaf = true;
      return node;
    }
    if (node.children) {
      makeTreeNodeLeaf(node.children, key);
      return node;
    }
    return node;
  });
};

// updateSelectedItems
const Archive = (props) => {
  const [hasRoot, setHasRoot] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [cookies] = useCookies(["userInfo"]);
  const [rootId, setRootId] = useState(undefined);

  const onLoadData = async (treeNode) => {
    let response = await getItem(cookies.userInfo.host, treeNode.key);
    try {
      let list = response.data["dcterms:hasPart"];
      if (!list || list.length === 0) {
        setTreeData((treeData) => makeTreeNodeLeaf(treeData, treeNode.key));
        return;
      }
      let thisChildren = list.map((each) => {
        let child = {
          key: each["value_resource_id"],
          title: each["display_title"],
          isLeaf: false,
        };
        if (each["thumbnail_url"]) {
          child.icon = (
            <img
              src={each["thumbnail_url"]}
              alt="placeholder"
              height="20"
              width="20"
            />
          );
        }
        return child;
      });
      setTreeData((treeData) =>
        updateTreeData(treeData, treeNode.key, thisChildren)
      );
    } catch (error) {
      Modal.error({
        title: "Item not found",
        content: "Please check the root id.",
      });
    }
  };

  const onConfirm = () => {
    getItem(cookies.userInfo.host, rootId).then((response) => {
      setTreeData([
        {
          title: response.data["o:title"]
            ? response.data["o:title"]
            : "untitled",
          key: response.data["o:id"],
          isLeaf: false,
        },
      ]);
      setHasRoot(true);
    });
  };

  return !hasRoot ? (
    <Space direction="vertical" style={{ width: "100%" }}>
      <h3>Root Item ID:</h3>
      <Input
        placeholder="Identify your root itemId. (16792)"
        value={rootId}
        onChange={({ target: { value } }) => {
          setRootId(value);
        }}
      />
      <Button type="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </Space>
  ) : (
    <DirectoryTree
      multiple
      blockNode={true}
      loadData={onLoadData}
      onCheck={(checkedKeys) => {
        props.updateSelectedItems(checkedKeys);
      }}
      checkable
      treeData={treeData}
    />
  );
};

export default Archive;
