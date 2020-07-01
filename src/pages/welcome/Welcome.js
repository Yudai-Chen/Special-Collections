import React, { Component } from "react";
import { Input, Space, Button } from "antd";
import { Link } from "react-router-dom";

const HOST_ADDRESS = "";

export default class Welcome extends Component {
  state = {
    host: "",
  };

  render() {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          addonBefore="Host Address"
          placeholder="Input the host IP address of the Omeka S backend."
          value={this.state.host}
          onChange={({ target: { value } }) => {
            this.setState({ host: value });
          }}
        />
        <Button type="primary" onClick={this.getHost}>
          <Link to="/home">Confirm</Link>
        </Button>
      </Space>
    );
  }
}
