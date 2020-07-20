import React, { Component } from "react";
import { Spin, Input, Modal, Button, Table, Space, Menu, Dropdown } from "antd";
import { withRouter, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { HOST_ADDRESS, key_credential, key_identity } from "./Mainpage";
import { PlaceHolder } from "../utils/Utils";

const headers = {
  "Content-Type": "application/json",
};

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
      compare: (a, b) => a.title.localeCompare(b.title),
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
  {
    title: "View",
    dataIndex: "view",
    render: (text, record) => (
      <Space size="middle">
        <Link to={"/items/" + record.key}>View</Link>
      </Space>
    ),
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
    projectLoading: false,
    projects: [],
    menuDisplay: "Select A Project",
    addProjectId: undefined,
  };

  constructor(props) {
    super(props);
    this.state.projectLoading = true;
    this.loadProjectList();
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  loadProjectList = () => {
    axios.get(HOST_ADDRESS + "/api/item_sets").then((response) => {
      let item_sets = response.data.map((each) => ({
        key: each["o:id"],
        title: each["o:title"],
      }));
      this.setState({ projects: item_sets }, () => {
        this.setState({ projectLoading: false });
      });
    });
  };

  onRowClick = (record) => {
    return axios
      .get(HOST_ADDRESS + "/iiif/" + record["itemId"] + "/manifest")
      .then((response) => {
        let mediaInfo = response.data["sequences"][0].canvases.map(
          (canvas, index) => ({
            key: index,
            src: canvas["thumbnail"]["@id"],
            alt: canvas["label"],
          })
        );
        return {
          item: record["title"],
          itemId: record["itemId"],
          mediaInfo: mediaInfo,
        };
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

    let payload = {
      "dcterms:title": [
        {
          type: "literal",
          property_id: 1,
          property_label: "Title",
          "@value": this.state.projectName,
        },
      ],
      "dcterms: description": [
        {
          type: "literal",
          property_id: 4,
          property_label: "Description",
          "@value": this.state.projectNote,
        },
      ],
    };

    axios
      .post(HOST_ADDRESS + "/api/item_sets", payload, {
        params: {
          key_identity,
          key_credential,
        },
        headers: headers,
      })
      .then((response) => {
        let projectId = response.data["o:id"];
        return this.state.selectedRowKeys.map((each) => {
          return axios
            .get(HOST_ADDRESS + "/api/items/" + each)
            .then((response) => {
              let originItemSets = response.data["o:item_set"]
                ? response.data["o:item_set"]
                : [];
              originItemSets.push({ "o:id": projectId });
              return axios.patch(
                HOST_ADDRESS + "/api/items/" + each,
                { "o:item_set": originItemSets },
                {
                  params: {
                    key_identity,
                    key_credential,
                  },
                  headers: headers,
                }
              );
            });
        });
      })
      .then((requests) => {
        axios.all(requests).then(() => {
          Modal.success({
            title: "Success!",
            content: "Create project success.",
          });
          this.setState({ projectLoading: true });
          this.loadProjectList();
        });
      });

    this.setModalVisible(false);
  };

  getPayload = (payload, transcriptItems) => {
    this.setState({ updated: "false" });
    this.setState({ showData: payload }, () => {
      this.setState({ updated: "true" });
    });
  };

  getSelectedFiles = (fileKeys) => {
    if (fileKeys.length > 0) {
      this.setState({ updated: "false" });
      let requests = fileKeys.map(async (eachItem) => {
        const response = await axios.get(
          HOST_ADDRESS + "/api/items/" + eachItem
        );
        if (!response.data["dcterms:hasPart"]) {
          try {
            return axios
              .get(
                HOST_ADDRESS +
                  "/api/media/" +
                  response.data["o:media"][0]["o:id"]
              )
              .then((response_1) => {
                return response_1.data["o:thumbnail_urls"]["square"];
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
            let src_1 = PlaceHolder;
            return {
              key: response.data["o:id"],
              itemId: response.data["o:id"],
              title: response.data["o:title"],
              created: response.data["o:created"]["@value"],
              preview: src_1,
            };
          }
        }
        const child = undefined;
        return child;
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
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps["type"]) {
      let oldSet = new Set(this.props["shownFiles"]);
      let newSet = new Set(nextProps["shownFiles"]);
      if (!eqSet(oldSet, newSet)) {
        this.getSelectedFiles(nextProps["shownFiles"]);
      }
      this.setState({ projects: nextProps["projects"] });
    } else {
      this.getPayload(nextProps["shownFiles"], nextProps["transcriptItems"]);
    }
    this.loadProjectList();
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  };

  setModal2Visible = (modal2Visible) => {
    this.setState({ modal2Visible });
  };

  onProjectAdd = () => {
    let projectId = this.state.addProjectId;
    if (!projectId) {
      Modal.error({
        title: "Fail to add to project!",
        content: "A project should be selected.",
      });
      return;
    }
    let requests = this.state.selectedRowKeys.map((each) => {
      return axios.get(HOST_ADDRESS + "/api/items/" + each).then((response) => {
        let originItemSets = response.data["o:item_set"]
          ? response.data["o:item_set"]
          : [];
        originItemSets.push({ "o:id": projectId });
        return axios.patch(
          HOST_ADDRESS + "/api/items/" + each,
          { "o:item_set": originItemSets },
          {
            params: {
              key_identity,
              key_credential,
            },
            headers: headers,
          }
        );
      });
    });

    axios.all(requests).then(
      Modal.success({
        title: "Success!",
        content: "Add to project success.",
      })
    );
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

    openInNewWindow("/react/#/note/" + JSON.stringify(data));
  };

  onMenuClick = ({ key }) => {
    try {
      let project = this.state.projects.filter((each) => each["key"] == key);
      this.setState({ menuDisplay: project[0]["title"], addProjectId: key });
    } catch (error) {}
  };

  expandedRowRender = (record) => {
    const columns = [
      {
        title: "Thumbnail",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (record) => <img src={record} width="20px" alt="" />,
      },
      { title: "Media Id", dataIndex: "mediaId", key: "mediaId" },
      { title: "Media Title", dataIndex: "mediaTitle", key: "mediaTitle" },
      {
        title: "Transcript",
        dataIndex: "transcript",
        key: "transcript",
        ellipsis: true,
      },
      {
        title: "View",
        dataIndex: "view",
        render: (text, record) => (
          <Space size="middle">
            <Link to={"/media/" + record.mediaId} target="_blank">
              View
            </Link>
          </Space>
        ),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={record["media"]}
        pagination={false}
      />
    );
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
        {this.state.projectLoading ? (
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
            expandable={{
              expandedRowRender:
                this.props.type === true ? this.expandedRowRender : null,
            }}
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
