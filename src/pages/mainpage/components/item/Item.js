import React, { Component } from "react";
import { Button, Divider, Row, Col, Spin, Layout, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import ImageView from "../../../../components/imageView/ImageView";
import Metadata from "../../../../components/metadata/Metadata";
import axios from "axios";

const { Sider, Content } = Layout;

function openInNewWindow(url) {
  const win = window.open(url, "_blank");
  if (win != null) {
    win.focus();
  }
}

export default class Item extends Component {
  state = {
    id: undefined,
    loading: false,
    data: [],
    media: [],
    active: 0,
    path: [],
    pathLoading: false,
    itemSet: "No Project",
  };

  constructor(props) {
    super(props);
    let itemId = parseInt(props.match.params.itemId, 10);
    if (itemId) {
      this.state.id = itemId;
      this.loadData(itemId);
    }
  }

  loadData = (itemId) => {
    if (itemId) {
      this.setState({ loading: true });
      axios
        .get("/api/items/" + itemId)
        .then((response) => {
          this.state.data = response.data;
          let media = response.data["o:media"];
          this.state.pathLoading = true;
          this.loadPath(itemId).then((path) => {
            this.setState({ path: path.reverse(), pathLoading: false });
          });
          let fetched = media.map((each) => {
            return axios.get("/api/media/" + each["o:id"]).then((mediaPage) => {
              return {
                key: mediaPage.data["o:id"],
                src: mediaPage.data["o:original_url"],
                alt: mediaPage.data["o:source"],
              };
            });
          });
          axios.all(fetched).then(
            axios.spread((...results) => {
              this.setState({ media: results, loading: false });
            })
          );
        })
        .then(() => {
          axios
            .get("/api/item_sets/" + this.state.data["o:item_set"][0]["o:id"])
            .then(
              (response) => {
                this.setState({ itemSet: response.data["o:title"] });
              },
              (error) => {}
            );
        });
    }
  };

  componentWillReceiveProps(nextProps) {
    let itemId = parseInt(nextProps.match.params.itemId, 10);
    this.setState({ id: itemId });
    this.loadData(itemId);
  }

  loadPath = (itemId, path = []) => {
    return axios.get("/api/items/" + itemId).then((response) => {
      if (response.data["dcterms:isPartOf"]) {
        path.push(...response.data["dcterms:isPartOf"]);
        return this.loadPath(
          response.data["dcterms:isPartOf"][0]["value_resource_id"],
          path
        );
      } else {
        return path;
      }
    });
  };

  onNoteAdd = () => {
    let data = [
      {
        key: this.state.id,
        title: this.state.data["o:title"],
        isLeaf: true,
      },
    ];

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

  render() {
    return this.state.loading ? (
      <div className="item-container">
        <div>
          <Spin tip="Loading..."></Spin>
        </div>
      </div>
    ) : (
      <div className="item-container">
        <div>
          <Layout>
            <Divider>{this.state.itemSet}</Divider>
            <Breadcrumb>
              {this.state.pathLoading ? (
                <Spin></Spin>
              ) : (
                this.state.path.map((each, key) => {
                  return (
                    <Breadcrumb.Item>
                      <Link to={"/items/" + each["value_resource_id"]}>
                        {each["display_title"]}
                      </Link>
                    </Breadcrumb.Item>
                  );
                })
              )}
              <Breadcrumb.Item>{this.state.data["o:title"]}</Breadcrumb.Item>
            </Breadcrumb>
            <Content>
              {this.state.media.length > 0 ? (
                <Row gutter={16}>
                  <Col span={8}>
                    <ImageView
                      id={this.state.id}
                      visible={!this.state.drawerVisible}
                      imgs={this.state.media}
                      active={this.state.active}
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
                    </div>
                  </Col>
                  <Col span={16}>
                    <Metadata
                      target={{
                        itemId: this.state.id,
                        data: this.state.data,
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                <Row gutter={16}>
                  <Col span={24}>
                    <Metadata
                      target={{
                        itemId: this.state.id,
                        data: this.state.data,
                      }}
                    />
                  </Col>
                </Row>
              )}
            </Content>
          </Layout>
        </div>
      </div>
    );
  }
}
