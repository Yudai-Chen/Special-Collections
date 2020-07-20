import React, { Component } from "react";
import { Space, Carousel } from "antd";
import { PlaceHolder } from "../utils/Utils";

export default class Preview extends Component {
  state = {
    item: "No Item",
    content: [
      {
        title: "No Image",
        src: PlaceHolder,
      },
    ],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps["target"]["item"]) {
      let item = nextProps["target"]["item"];
      if (nextProps["target"]["mediaInfo"].length > 0) {
        this.setState({
          item: item,
          content: nextProps["target"]["mediaInfo"],
        });
      } else {
        this.setState({
          item: item,
          content: [
            {
              title: "No Image",
              src: PlaceHolder,
            },
          ],
        });
      }
    }
  }

  render() {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <div align="center">
          <div className="ant-descriptions-title">Preview</div>
          <Carousel autoplay>
            {this.state.content.map((each) => {
              return (
                <div>
                  <img
                    src={each.src}
                    alt={each.title}
                    height="200"
                    width="200"
                  />
                  <p>{each.title}</p>
                </div>
              );
            })}
          </Carousel>
          <p>{this.state.item}</p>
        </div>
      </Space>
    );
  }
}
