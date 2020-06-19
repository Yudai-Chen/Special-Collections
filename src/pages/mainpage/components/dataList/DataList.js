import React, { Component } from "react";
import { Spin, Input, Modal, Button, Table, Space, Menu, Dropdown } from "antd";
import { withRouter, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";

const placeholder = require("../../../../image-placeholder.png");

const columns = [
  {
    title: "Preview",
    dataIndex: "preview",
    render: (record) => <img src={record} width="20px" alt="" />,
  },
  {
    title: "ItemId",
    dataIndex: "itemId",
    sorter: {
      compare: (a, b) => a.itemId - b.itemId,
      // multiple: 3,
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: {
      compare: (a, b) => a.item.localeCompare(b.item),
      // multiple: 3,
    },
  },
  {
    title: "Created",
    dataIndex: "created",
    sorter: {
      compare: (a, b) => {
        let date1 = Date.parse(a.created);
        let date2 = Date.parse(b.created);
        return date1 - date2;
      },
      // multiple: 3,
    },
  },
];

function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

function openInNewWindow(url) {
  const win = window.open(url, "_blank");
  if (win != null) {
    win.focus();
  }
}

class DataList extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    showData: [],
    updated: "true",
    modalVisible: false,
    modal2Visible: false,
    projectName: undefined,
    projectNote: undefined,
    loadingProject: false,
    projects: [],
    menuDisplay: "Select A Project",
    addProjectId: undefined,
  };

  constructor(props) {
    super(props);
    try {
      if (props["project"]["key"]) {
        this.state.projects.push(props["project"]);
      }
    } catch (error) {}
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  onRowClick = (record) => {
    return axios.get("/api/items/" + record["itemId"]).then((response) => {
      let media = response.data["o:media"];
      let requests = media.map((each) => {
        return axios.get("/api/media/" + each["o:id"]);
      });
      let mediaInfo = [];
      return axios
        .all(requests)
        .then(
          axios.spread((...mediaPage) => {
            mediaPage.map((each) => {
              mediaInfo.push({
                title: each.data["o:title"],
                src: each.data["o:thumbnail_urls"]["medium"],
              });
            });
          })
        )
        .then(() => {
          return {
            item: record["title"],
            itemId: record["itemId"],
            mediaInfo: mediaInfo,
          };
        });
    });
  };

  findNewProjectId = () => {
    return Math.floor(Math.random() * 1000);
  };

  onCreateProject = () => {
    if (
      this.state.projectName === undefined ||
      this.state.projectName.length === 0
    ) {
      Modal.error({
        title: "Fail to create project!",
        content: "The project name cannot be null.",
      });
      return;
    }
    let projectId = this.findNewProjectId();
    let data = [];
    this.state.selectedRows.map((each) => {
      data.push({
        key: projectId + "-" + each["itemId"],
        itemId: each["itemId"],
        title: each["title"],
        isLeaf: true,
      });
    });
    let project = {
      title: this.state.projectName,
      key: projectId,
      note: this.state.projectNote,
      children: data,
    };
    this.props.handleCreateProject(project);
    this.setModalVisible(false);
  };

  getSelectedFiles = (fileKeys) => {
    this.setState({ updated: "false" });
    let requests = fileKeys.map((eachItem) => {
      return axios
        .get("/api/items/" + eachItem)
        .then((response) => {
          if (!response.data["dcterms:hasPart"]) {
            try {
              return axios
                .get("/api/media/" + response.data["o:media"][0]["o:id"])
                .then((response) => {
                  return response.data["o:thumbnail_urls"]["square"];
                })
                .then((src) => {
                  return {
                    key: response.data["o:id"],
                    itemId: response.data["o:id"],
                    title: response.data["o:title"],
                    created: response.data["o:created"]["@value"],
                    preview: src,
                  };
                });
            } catch (err) {
              let src = placeholder;
              return {
                key: response.data["o:id"],
                itemId: response.data["o:id"],
                title: response.data["o:title"],
                created: response.data["o:created"]["@value"],
                preview: src,
              };
            }
          }
        })
        .then((child) => {
          return child;
        });
    });

    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          let data = [];
          responses.map((each) => {
            if (each) {
              data.push(each);
            }
          });
          this.setState({ showData: data });
          this.setState({ updated: "true" });
        })
      )
      .catch((errors) => {});
  };

  componentWillReceiveProps(nextProps) {
    let oldSet = new Set(this.props["shownFiles"]);
    let newSet = new Set(nextProps["shownFiles"]);
    if (!eqSet(oldSet, newSet)) {
      this.getSelectedFiles(nextProps["shownFiles"]);
    }
    this.setState({ projects: nextProps["projects"] });
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  };

  setModal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  };

  onProjectAdd = () => {
    let key = this.state.addProjectId;
    if (!key) {
      Modal.error({
        title: "Fail to add to project!",
        content: "A project should be selected.",
      });
      return;
    }
    let all = this.state.projects;
    all.map((eachProject) => {
      if (eachProject.key == key) {
        let oldChildren = [];
        eachProject.children.map((eachChild) => {
          oldChildren.push(eachChild["itemId"]);
        });
        let oldChildrenSet = new Set(oldChildren);
        this.state.selectedRows.map((eachRow) => {
          if (!oldChildrenSet.has(eachRow["itemId"])) {
            eachProject.children.push({
              key: key + "-" + eachRow["itemId"],
              itemId: eachRow["itemId"],
              title: eachRow["title"],
              isLeaf: true,
            });
          }
        });
      }
    });
    this.props.updataProjects(all);
    this.setModal2Visible(false);
  };

  onNoteAdd = () => {
    let data = this.state.selectedRows.map((each) => {
      return {
        key: each["itemId"],
        title: each["title"],
        isLeaf: true,
      };
    });

    openInNewWindow("/#/note/" + JSON.stringify(data));
    // return (
    //   <Link
    //     to={{
    //       pathname: "/note",
    //       state: { targets: data },
    //     }}
    //     target="_blank"
    //   ></Link>
    // );
  };

  onMenuClick = ({ key }) => {
    try {
      let project = this.state.projects.filter((each) => each["key"] == key);
      this.setState({ menuDisplay: project[0]["title"], addProjectId: key });
    } catch (error) {}
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    };
    const menu = (
      <Menu onClick={this.onMenuClick}>
        {this.state.loadingProject ? (
          <Spin></Spin>
        ) : (
          this.state.projects.map((each) => (
            <Menu.Item key={each["key"]}>{each["title"]}</Menu.Item>
          ))
        )}
      </Menu>
    );
    return (
      <div>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Table
            loading={
              this.props.shownFiles.length !== 0 &&
              this.state.updated === "false"
            }
            onRow={(record) => {
              return {
                onClick: (event) => {
                  this.onRowClick(record).then((result) => {
                    this.props.handleRowClick(result);
                  });
                },
              };
            }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.state.showData}
          />
          <div
            style={{
              display: "flex",
              "justify-content": "flex-end",
            }}
          >
            <div style={{ margin: "5px" }}>
              <Button onClick={this.onNoteAdd}>Add Note</Button>
            </div>
            <div style={{ margin: "5px" }}>
              <Button onClick={() => this.setModal2Visible(true)}>
                Add To Project
              </Button>
            </div>
            <div style={{ margin: "5px" }}>
              <Button type="primary" onClick={() => this.setModalVisible(true)}>
                Create Project
              </Button>
            </div>
          </div>
          <Modal
            title="New Project"
            centered
            visible={this.state.modalVisible}
            onOk={this.onCreateProject}
            onCancel={() => this.setModalVisible(false)}
          >
            <div style={{ marginBottom: 16 }}>
              <Input
                addonBefore="Project Name"
                placeholder="Name your project here."
                value={this.state.projectName}
                onChange={({ target: { value } }) => {
                  this.setState({ projectName: value });
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input
                addonBefore="Description"
                placeholder="Add your description for this project."
                value={this.state.projectNote}
                onChange={({ target: { value } }) => {
                  this.setState({ projectNote: value });
                }}
              />
            </div>
          </Modal>
          <Modal
            title="Add to Project"
            centered
            visible={this.state.modal2Visible}
            onOk={this.onProjectAdd}
            onCancel={() => this.setModal2Visible(false)}
          >
            <Dropdown overlay={menu} trigger={["click"]}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {this.state.menuDisplay} <DownOutlined />
              </a>
            </Dropdown>
          </Modal>
        </Space>
      </div>
    );
  }
}

export default withRouter(DataList);
