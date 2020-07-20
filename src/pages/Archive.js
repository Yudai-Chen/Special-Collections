import React, { Component } from "react";
import axios from "axios";
import { Tree } from "antd";
import { HOST_ADDRESS } from "./Mainpage";
import "antd/dist/antd.css";

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

function makeTreeNodeLeaf(list, key) {
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

export default class Archive extends Component {
  state = {
    treeData: [],
    checkedFiles: [],
  };

  constructor(props) {
    super(props);
    this.getRootData().then((rootData) => {
      this.setState({ treeData: rootData });
    });
  }

  async getRootData() {
    const response = await axios.get(HOST_ADDRESS + "/api/items/103719");
    const rootId = response.data["o:id"];
    const rootTitle = response.data["o:title"];
    const rootData = [
      {
        title: rootTitle,
        key: rootId,
        isLeaf: false,
      },
    ];
    return rootData;
  }

  onCheck = (checkedKeys) => {
    const files = [];
    checkedKeys.map((each) => {
      files.push(each);
    });
    this.setState({ checkedFiles: files });
    this.props.updateSelectedFiles(files);
  };

  onLoadData = async (treeNode) => {
    const parentId = treeNode.key;
    const response = await axios.get(HOST_ADDRESS + "/api/items/" + parentId);

    let list = response.data["dcterms:hasPart"];
    let thisChildren = [];

    return new Promise(async (resolve) => {
      if (!list || list.length === 0) {
        let dataList = this.state.treeData;
        dataList = makeTreeNodeLeaf(dataList, treeNode.key);
        this.setState({
          treeData: dataList,
        });
        resolve();
        return;
      }

      if (list && list.length > 0) {
        list.map((each) => {
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
          thisChildren.push(child);
          return child;
        });
      }

      let dataList = this.state.treeData;
      dataList = updateTreeData(dataList, treeNode.key, thisChildren);
      this.setState({
        treeData: dataList,
      });
      resolve();
    });
  };

  render() {
    return (
      <div className="archive-container">
        <DirectoryTree
          multiple
          blockNode={true}
          loadData={this.onLoadData}
          onCheck={this.onCheck}
          checkable
          treeData={this.state.treeData}
        />
      </div>
    );
  }
}
