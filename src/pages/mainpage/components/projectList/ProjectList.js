import React, { Component } from "react";
import { Spin, Tree } from "antd";

const { DirectoryTree } = Tree;

export default class ProjectList extends Component {
  state = {
    projects: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    if (props["project"]["key"]) {
      this.state.projects.push(props["project"]);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps["project"]["key"] !== this.props["project"]["key"]) {
      this.setState({ loading: true });
      let data = this.state.projects;
      data.push(nextProps["project"]);
      this.setState({ projects: data }, () => {
        this.setState({ loading: false });
      });
    }
  }

  onSelect = (selectedKeys) => {
    this.props.onProjectListSelect(selectedKeys);
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
