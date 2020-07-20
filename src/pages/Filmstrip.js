import React, { Component } from "react";
import { Card, Col, Row } from "antd";
import axios from "axios";
import { HOST_ADDRESS } from "./Mainpage";
const { Meta } = Card;

export default class Filmstrip extends Component {
  state = {
    loading: true,
    showData: [],
  };

  constructor(props) {
    super(props);
    this.getSelectedFiles(props.shownFiles);
  }

  getSelectedFiles = async (fileKeys) => {
    let data = [];
    let total = 0;
    const promises = fileKeys.map(async (eachItem) => {
      let response = await axios.get(HOST_ADDRESS + "/api/items/" + eachItem);
      let media = response.data["o:media"];
      let itemTitle = response.data["o:title"];
      if (media.length > 0) {
        total += media.length;
        let innerPromises = media.map(async (each) => {
          let mediaPage = await axios.get(
            HOST_ADDRESS + "/api/media/" + each["o:id"]
          );

          data.push(
            <Col className="gutter-row" span={6}>
              <Card
                size="small"
                hoverable
                style={{ width: "90%" }}
                cover={
                  <img
                    alt="example"
                    src={mediaPage.data["o:thumbnail_urls"]["large"]}
                  />
                }
                bordered={false}
              >
                <Meta
                  title={itemTitle}
                  description={mediaPage.data["o:title"]}
                />
              </Card>
            </Col>
          );
        });
        await Promise.all(innerPromises);
      }
    });
    await Promise.all(promises);
    let rowedData = [];
    for (let i = 0; i < total / 4 + 1; i++) {
      rowedData.push(
        <Row gutter={[16, 24]}>{data.slice(i * 4 + 0, i * 4 + 4)}</Row>
      );
    }
    this.setState({ showData: rowedData });
    return data;
  };

  async componentWillReceiveProps(nextProps) {
    this.setState({ loading: true });
    await this.getSelectedFiles(nextProps["shownFiles"]);
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="site-card-wrapper">
        {/* <Row gutter={6}>
          <Col span={6}> */}
        {this.state.showData}
        {/* </Row> */}
      </div>
    );
  }
}
