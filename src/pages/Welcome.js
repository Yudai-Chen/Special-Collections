import React, { Component } from "react";
import { Modal, Input, Space, Button } from "antd";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export default class Welcome extends Component {
  state = {
    config: {
      host: "",
      key_identity: "",
      key_credential: "",
    },
    isAuthenticated: false,
  };

  sendTest = () => {
    let payload = {
      "dcterms:title": [
        {
          type: "literal",
          property_id: 1,
          property_label: "Title",
          "@value": "[NEED DELETION] Item for Authentication",
        },
      ],
      "dcterms:abstract": [
        {
          type: "literal",
          property_id: 19,
          property_label: "Abstract",
          is_public: true,
          "@value":
            "If you have found this item in the dashboard, please feel free to delete it.",
        },
      ],
    };
    axios
      .post("http://" + this.state.config.host + "/api/items", payload, {
        params: {
          key_identity: this.state.config.key_identity,
          key_credential: this.state.config.key_credential,
        },
        headers: headers,
      })
      .then((response) => {
        this.setState({
          config: {
            ...this.state.config,
            key_identity: "",
            key_credential: "",
          },
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
        } else {
          Modal.error({
            title: "Connection fails",
            content: "Please check the host address.",
          });
        }
      });
  };

  render() {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          addonBefore="Host Address"
          placeholder='Input the host IP address of the Omeka S backend. Please leave out "http://"'
          value={this.state.config.host}
          onChange={({ target: { value } }) => {
            this.setState({
              config: { ...this.state.config, host: value },
            });
          }}
        />
        <Input
          addonBefore="key_identity"
          placeholder="Input your key_identity. Check it the on Omeka Admin dashboard -> User -> API Keys."
          value={this.state.config.key_identity}
          onChange={({ target: { value } }) => {
            this.setState({
              config: { ...this.state.config, key_identity: value },
            });
          }}
        />
        <Input
          addonBefore="key_credential"
          placeholder="Input your key_credential. Check it the on Omeka Admin dashboard -> User -> API Keys."
          value={this.state.config.key_credential}
          onChange={({ target: { value } }) => {
            this.setState({
              config: { ...this.state.config, key_credential: value },
            });
          }}
        />
        <Button type="primary" onClick={this.sendTest}>
          Log in
        </Button>
      </Space>
    );
  }
}
