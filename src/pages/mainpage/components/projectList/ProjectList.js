import React, { Component } from "react";
import { Spin, Tree } from "antd";
import { Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import { HOST_ADDRESS } from "../../Mainpage";
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

class ProjectList extends Component {
  state = {
    projects: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    try {
      this.loadProjectList();
    } catch (error) {}
  }

  onLoadData = async (treeNode) => {
    let item_set_id = treeNode.key;
    const response = await axios.get(
      HOST_ADDRESS + "/api/items?item_set_id=" + item_set_id
    );
    let thisChildren = response.data.map((each) => ({
      key: item_set_id + "-" + each["o:id"],
      title: each["o:title"],
      isLeaf: true,
    }));

    return new Promise(async (resolve) => {
      if (!thisChildren || thisChildren.length === 0) {
        resolve();
        return;
      }
      let data = this.state.projects;
      data = updateTreeData(data, treeNode.key, thisChildren);
      this.setState({
        projects: data,
      });
      resolve();
    });
  };

  loadProjectList = () => {
    this.state.projectLoading = true;
    axios.get(HOST_ADDRESS + "/api/item_sets").then((response) => {
      let item_sets = response.data.map((each) => ({
        key: each["o:id"],
        title: each["o:title"],
        isLeaf: false,
      }));
      this.setState({ projects: item_sets }, () => {
        this.setState({ projectLoading: false });
      });
    });
  };

  componentDidMount() {}

  onSelect = (itemKey) => {
    let itemId;
    if (String(itemKey[0]).indexOf("-") != -1) {
      itemId = itemKey[0].substring(
        itemKey[0].indexOf("-") + 1,
        itemKey[0].length
      );
      this.props.history.push("/items/" + itemId);
    }
  };

  render() {
    return this.state.projectLoading || this.state.loading ? (
      <div>
        <Spin tip="Loading..."></Spin>
      </div>
    ) : (
      <div className="project-list-container">
        <DirectoryTree
          treeData={this.state.projects}
          loadData={this.onLoadData}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}

export default withRouter(ProjectList);
