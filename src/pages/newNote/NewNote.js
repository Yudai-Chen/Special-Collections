import React, { Component } from "react";
import { Button, Input, Row, Col, Spin, Tree } from "antd";
import { withRouter } from "react-router";

const { DirectoryTree } = Tree;
const { TextArea } = Input;

class NewNote extends Component {
  state = {
    input: "",
    targets: [],
    loading: false,
    checkedFiles: [],
  };

  constructor(props) {
    super(props);
    let targets = props.match.params.targetList;
    console.log(JSON.parse(targets));
    this.state.targets = JSON.parse(targets);
    // if (this.props.location.state !== undefined) {
    //   const { targets } = this.props.location.state;
    //   this.state.targets = targets;
    // }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.location.state !== undefined) {
    //   this.setState({ loading: true });
    //   const { targets } = nextProps.location.state;
    //   this.setState({ targets }, () => {
    //     this.setState({ loading: false });
    //   });
    // }
  }

  onTextChange = ({ target: { value } }) => {
    this.setState({ input: value });
  };

  onCheck = (checkedKeys) => {
    const files = [];
    checkedKeys.map((each) => {
      files.push(each);
    });
    this.setState({ checkedFiles: files });
  };

  onRemove = () => {
    let data = this.state.targets;
    this.setState({ loading: true });
    this.state.checkedFiles.map((eachKey) => {
      let index;
      data.forEach((each, i) => {
        if (each["key"] == eachKey) {
          index = i;
        }
      });
      data.splice(index, 1);
      //   data.remove();
    });
    this.setState({ targets: data }, () => {
      this.setState({ loading: false });
    });
  };

  render() {
    return this.state.loading ? (
      <Spin></Spin>
    ) : (
      <div>
        <Row gutter={[16, 24]} justify="end">
          <Col span={12}>
            <Col span={24}>
              <h2>Attach to:</h2>
              <DirectoryTree
                treeData={this.state.targets}
                blockNode={true}
                checkable
                onCheck={this.onCheck}
              />
            </Col>
            <Col span={6}>
              <Button onClick={this.onRemove}>Remove</Button>
            </Col>
          </Col>
          <Col span={12}>
            <Row gutter={[16, 24]} justify="end">
              <Col span={24}>
                <h2>Note:</h2>
                <TextArea
                  value={this.state.input}
                  onChange={this.onTextChange}
                  autoSize={{ minRows: 25, maxRows: 25 }}
                />
              </Col>
              <Col span={6}>
                <Button type="primary" onClick={() => {}}>
                  Submit Change
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(NewNote);
