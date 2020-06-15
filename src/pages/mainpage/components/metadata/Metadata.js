import React, { Component } from "react";
import { Descriptions } from "antd";
import axios from "axios";

export default class Metadata extends Component {
  state = {
    dataKey: [],
    dataValue: [],
  };

  constructor(props) {
    super(props);
    this.getData(props["target"]["itemId"]);
  }

  getData(itemId) {
    let labels = [];
    axios.get("/api/items/" + itemId).then((response) => {
      for (var val in response.data) {
        labels.push(val);
      }
      let value = labels.map((each) => {
        return JSON.stringify(response.data[each]);
      });
      this.setState({ dataKey: labels, dataValue: value });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps["target"] && nextProps["target"]["itemId"]) {
      this.getData(nextProps["target"]["itemId"]);
    }
  }

  render() {
    return (
      <div>
        <br />
        <Descriptions bordered size="small" column={1}>
          {this.state.dataKey.map((each, index) => {
            return (
              <Descriptions.Item key={index} label={each}>
                {this.state.dataValue[index]}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </div>
    );
  }
}
