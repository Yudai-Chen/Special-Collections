import React, { Component } from "react";
import { Divider, Row, Col, Spin, Layout, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import ImageView from "../imageView/ImageView";
import Metadata from "../metadata/Metadata";
import axios from "axios";

const { Content } = Layout;

export default class Item extends Component {
  state = {
    id: undefined,
    loading: true,
    data: [],
    media: [],
    active: 0,
    path: [],
    pathLoading: false,
  };

  constructor(props) {
    super(props);
    this.state.id = props.itemId;
    axios.get("/api/items/" + props.itemId).then((response) => {
      this.state.data = response.data;
      let media = response.data["o:media"];
      this.state.pathLoading = true;
      this.loadPath(props.itemId).then((path) => {
        this.setState({ path: path, pathLoading: false });
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
    });
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

  render() {
    return this.state.loading ? (
      <div>
        <Spin tip="Loading..."></Spin>
      </div>
    ) : (
      <div>
        <Layout>
          <Divider>{this.state.data["o:title"]}</Divider>
          <Breadcrumb>
            {this.state.pathLoading ? (
              <Spin></Spin>
            ) : (
              this.state.path.reverse().map((each) => {
                return (
                  <Breadcrumb.Item>
                    <Link to="/">{each["display_title"]}</Link>
                  </Breadcrumb.Item>
                );
              })
            )}
            <Breadcrumb.Item>{this.state.data["o:title"]}</Breadcrumb.Item>
          </Breadcrumb>
          <Content>
            <Row gutter={16}>
              <Col span={8}>
                <ImageView
                  id={this.state.id}
                  visible={!this.state.drawerVisible}
                  imgs={this.state.media}
                  active={this.state.active}
                />
              </Col>
              <Col span={16}>
                <Metadata
                  target={{ itemId: this.props.itemId, data: this.state.data }}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}
