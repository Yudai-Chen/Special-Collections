import React, { useState } from "react";
import { Modal, Input, Space, Button } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useHistory, useLocation } from "react-router-dom";
import { PATH_PREFIX } from "../utils/Utils"

const headers = {
  "Content-Type": "application/json",
};


const Welcome = (props) => {
  const [config, setConfig] = useState({});
  let [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: PATH_PREFIX + "/main" } };

  const sendTest = () => {
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
      .post("http://" + config.host + "/api/items", payload, {
        params: {
          key_identity: config.key_identity,
          key_credential: config.key_credential,
        },
        headers: headers,
      })
      .then((response) => {
        setConfig({
          ...config,
          key_identity: "",
          key_credential: "",
        });

        setCookie("userInfo", config, { path: "/" });
        axios.delete(
          "http://" +
          config.host +
          "/api/items/" +
          response.data["o:id"],
          {
            params: {
              key_identity: config.key_identity,
              key_credential: config.key_credential,
            },
            headers: headers,
          }
        );
        history.replace(from);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            Modal.error({
              title: "Authentication fails",
              content: "Invalid keys.",
            });
          }
        } else {
          Modal.error({
            title: "Connection fails",
            content: "Please check the host address.",
          });
        }
      });
  }

  const onLogOut = () => {
    removeCookie("userInfo", { path: "/" });
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        addonBefore="Host Address"
        placeholder='Input the host IP address of the Omeka S backend. Please leave out "http://" and do not end with a "/"'
        value={config.host}
        onChange={({ target: { value } }) => {
          setConfig({
            ...config, host: value
          });
        }}
      />
      <Input
        addonBefore="key_identity"
        placeholder="Input your key_identity. Check it the on Omeka Admin dashboard -> User -> API Keys."
        value={config.key_identity}
        onChange={({ target: { value } }) => {
          setConfig({
            ...config, key_identity: value
          });
        }}
      />
      <Input
        addonBefore="key_credential"
        placeholder="Input your key_credential. Check it the on Omeka Admin dashboard -> User -> API Keys."
        value={config.key_credential}
        onChange={({ target: { value } }) => {
          setConfig({
            ...config, key_credential: value
          });
        }}
      />
      <Button type="primary" onClick={sendTest}>
        Log in
      </Button>
      <Button type="primary" onClick={onLogOut}>
        Log out
      </Button>
    </Space>
  );
}

export default Welcome;
