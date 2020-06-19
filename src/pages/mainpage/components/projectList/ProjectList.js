import React, { Component } from "react";
import { Spin, Tree } from "antd";
import { Redirect, Route } from "react-router-dom";

const { DirectoryTree } = Tree;

export default class ProjectList extends Component {
  state = {
    projects: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    try {
      this.state.projects = props["projects"];
    } catch (error) {}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    this.setState({ projects: nextProps["projects"] }, () => {
      this.setState({ loading: false });
    });
  }

  onSelect = (itemKey) => {
    let itemId;
    if (String(itemKey[0]).indexOf("-") != -1) {
      itemId = itemKey[0].substring(
        itemKey[0].indexOf("-") + 1,
        itemKey[0].length
      );
    }
    return <Redirect push to={"/items/" + itemId} />;
  };

  render() {
    return this.state.loading ? (
      <div>
        <Spin tip="Loading..."></Spin>
      </div>
    ) : (
      <div className="project-list-container">
        <DirectoryTree
          treeData={this.state.projects}
          blockNode={true}
          onSelect={this.onSelect}
        />
      </div>
    );
  }
}
