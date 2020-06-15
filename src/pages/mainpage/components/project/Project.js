import React, { Component } from "react";
import Item from "../item/Item";
import { Divider, Col, Row } from "antd";

export default class Project extends Component {
  render() {
    try {
      let itemList = this.props["project"]["children"];
      return (
        <div>
          <Divider>
            <h2>{this.props["project"]["title"]}</h2>
          </Divider>
          <Row gutter={[16, 24]}>
            {itemList.map((each) => (
              <Col span={24}>
                <Item itemId={each["itemId"]} />
                <Divider style={{ height: "20" }} />
              </Col>
            ))}
          </Row>
        </div>
      );
    } catch {
      return null;
    }
  }
}
