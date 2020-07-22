import React, { useState, useEffect } from "react";
import { Input, Tree, Button } from "antd";
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
}

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
}

const Archive = (props) => {
  const [hasRoot, setHasRoot] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [userInfo] = useCookies(["userInfo"]);
  const [rootId, setRootId] = useState(undefined);

  const onLoadData = (treeNode) => {
    getItem(userInfo.host, treeNode.key).then((response) => {
      let list = response.data["dcterms:hasPart"];
      if (!list || list.length === 0) {
        setTreeData(makeTreeNodeLeaf(treeData, treeNode.key));
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
            <img src={each["thumbnail_url"]} height="20" width="20" />
          );
        }
        return child;
      });
      setTreeData(updateTreeData(treeData, treeNode.key, thisChildren));
    })
  };

  const onConfirm = () => {
    getItem(userInfo.host, rootId).then((response) => {
      setTreeData([
        {
          title: response.data["o:title"] ? response.data["o:title"] : "untitled",
          key: response.data["o:id"],
          isLeaf: false,
        },
      ]);
      setHasRoot(true);
    })
  }

  return !hasRoot ? (
    <>
      <Input
        addonBefore="Root Item ID"
        placeholder="Please identify your root item id.(103719)"
        value={rootId}
        onChange={({ target: { value } }) => {
          setRootId(value);
        }}
      />
      <Button type="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </>) : (
      <DirectoryTree
        multiple
        blockNode={true}
        loadData={onLoadData}
        onCheck={(checkedKeys) => {
          props.updateSelectedFiles(checkedKeys)
        }}
        checkable
        treeData={treeData}
      />
    );
}

export default Archive;
