import React, { Component } from "react";
import { Table, Spin } from "antd";
import axios from "axios";
import { HOST_ADDRESS } from "./Mainpage";

const columns = [
  {
    title: "Label",
    dataIndex: "label",
    width: "30%",
  },
  {
    title: "Value",
    dataIndex: "value",
    width: "70%",
  },
];

export default class Metadata extends Component {
  state = {
    data: [],
    loading: false,
  };

  constructor(props) {
    super(props);
    this.getData(props["target"]["itemId"], props["target"]["data"]);
  }

  getData(itemId, data) {
    if (!data) {
      if (itemId) {
        let labels = [];
        this.setState({ loading: true });
        axios
          .get(HOST_ADDRESS + "/iiif/" + itemId + "/manifest")
          .then((response) => {
            labels = response.data["metadata"];
            this.setState({ data: labels, loading: false });
          });
      }
    } else {
      let labels = [];
      for (var val in data) {
        if (
          val.indexOf("o:") === -1 &&
          val.indexOf("@") === -1 &&
          val.indexOf("isPartOf") === -1 &&
          val.indexOf("hasPart") === -1
        ) {
          labels.push({
            label: JSON.stringify(data[val][0]["property_label"]),
            value: JSON.stringify(data[val][0]["@value"]),
          });
        }
      }
      this.setState({ data: labels, loading: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps["target"] && nextProps["target"]["itemId"]) {
      this.getData(nextProps["target"]["itemId"], nextProps["target"]["data"]);
    }
  }

  render() {
    return this.state.loading ? (
      <Spin tip="loading..."></Spin>
    ) : (
      <div>
        <Table
          loading={this.state.length !== 0 && this.state.updated === true}
          columns={columns}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}
