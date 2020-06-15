import React, { Component } from "react";
import {
  Divider,
  Button,
  Row,
  Col,
  Drawer,
  Table,
  Spin,
  Layout,
  Input,
  Breadcrumb,
} from "antd";
import ImageView from "../imageView/ImageView";
import Metadata from "../metadata/Metadata";
import axios from "axios";
const { Content } = Layout;
const { TextArea } = Input;

const columns = [
  {
    title: "Media",
    dataIndex: "alt",
    width: "30%",
  },
  {
    title: "Transcript",
    dataIndex: "transcript",
    ellipsis: true,
    width: "70%",
  },
];

export default class Item extends Component {
  state = {
    id: undefined,
    loading: true,
    data: [],
    media: [],
    drawerVisible: false,
    transSrc: undefined,
    transText: undefined,
    transTitle: undefined,
    active: 0,
  };

  constructor(props) {
    super(props);
    this.state.id = props.itemId;
    axios.get("/api/items/" + props.itemId).then((response) => {
      this.state.data = response.data;
      let media = response.data["o:media"];
      let fetched = media.map((each) => {
        return axios.get("/api/media/" + each["o:id"]).then((mediaPage) => {
          return {
            key: mediaPage.data["o:id"],
            src: mediaPage.data["o:original_url"],
            alt: mediaPage.data["o:source"],
            transcript: mediaPage.data["bibo:transcriptOf"]
              ? mediaPage.data["bibo:transcriptOf"][0]["@value"]
              : "",
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

  showDrawer = () => {
    this.setState({
      drawervisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawervisible: false,
    });
  };

  onClickTrans = (record) => {
    this.state.media.some((each, index) => {
      if (each["key"] == record["key"]) {
        this.setState({
          transTitle: each["alt"],
          transSrc: each["src"],
          transText: each["transcript"],
          active: index,
        });
        return true;
      }
    });
    this.showDrawer();
  };

  onTextChange = ({ target: { value } }) => {
    this.setState({ transText: value });
  };

  onSubmitTrans = () => {
    let mediaData = this.state.media;
    mediaData[this.state.active]["transcript"] = this.state.transText;
    this.setState({ media: mediaData, drawervisible: false });
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
            <Breadcrumb.Item>
              <a href="">Home</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Application Center</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Application List</a>
            </Breadcrumb.Item>
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
              <Col span={8}>
                <Table
                  loading={
                    this.state.length !== 0 && this.state.updated === true
                  }
                  onRow={(record) => {
                    return {
                      onClick: (event) => {
                        this.onClickTrans(record);
                      },
                    };
                  }}
                  columns={columns}
                  dataSource={this.state.media}
                />
              </Col>
              <Col span={8}>
                <Metadata target={{ itemId: this.props.itemId }} />
              </Col>
            </Row>
            <Drawer
              title={this.state.transTitle}
              placement="right"
              closable={false}
              onClose={this.onClose}
              visible={this.state.drawervisible}
              getContainer={false}
              style={{ position: "absolute" }}
              width="55%"
            >
              <Layout>
                <Content>
                  <Row gutter={[16, 24]} justify="end">
                    <Col span={12}>
                      <ImageView
                        id={"temp"}
                        visible={true}
                        imgs={this.state.media}
                        active={this.state.active}
                      />
                    </Col>
                    <Col span={12}>
                      <TextArea
                        value={this.state.transText}
                        onChange={this.onTextChange}
                        autoSize={{ minRows: 10 }}
                      />
                    </Col>
                    <Col span={6}>
                      <Button type="primary" onClick={this.onSubmitTrans}>
                        Submit Change
                      </Button>
                    </Col>
                  </Row>
                </Content>
              </Layout>
            </Drawer>
          </Content>
        </Layout>
      </div>
    );
  }
}
