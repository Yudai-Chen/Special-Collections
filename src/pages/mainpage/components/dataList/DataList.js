import React, { Component } from "react";
import { Input, Modal, Button, Table, Space } from "antd";
import axios from "axios";

const placeholder = require("../../image-placeholder.png");

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

export default class DataList extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    showData: [],
    updated: "true",
    modalVisible: false,
    projectName: undefined,
    projectNote: undefined,
  };

  constructor(props) {
    super(props);
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
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
    };
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
          <div align="right">
            <Button type="primary" onClick={() => this.setModalVisible(true)}>
              Create Project
            </Button>
          </div>
          <Modal
            title="New Project"
            centered
            visible={this.state.modalVisible}
            onOk={() => {
              this.onCreateProject();
            }}
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
                addonBefore="Project Note"
                placeholder="Add your note for this project."
                value={this.state.projectNote}
                onChange={({ target: { value } }) => {
                  this.setState({ projectNote: value });
                }}
              />
            </div>
          </Modal>
        </Space>
      </div>
    );
  }
}
