import React, { useState, useEffect } from "react";
import NoteInput from "../components/NoteInput";
import { useParams } from "react-router-dom";
import { getItems, PATH_PREFIX } from "../utils/Utils";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Spin, Row, Col, Menu, Layout } from "antd";
import LogoHeader from "../components/LogoHeader";

const { Content } = Layout;
// In this component, I've hardcoded the property ID of "dcterms:references" as 36, "dcterms:isReferencedBy" as 35. I think it is a default configuration of Omeka S
const NoteView = () => {
  const [cookies] = useCookies(["userInfo"]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { targetList } = useParams();

  useEffect(() => {
    let targets = JSON.parse(targetList);
    setLoading(true);
    getItems(cookies.userInfo.host, targets).then(
      axios.spread((...responses) => {
        let data = responses.map((each) => each.data);
        setData(data);
      })
    );
  }, [cookies.userInfo, targetList]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return (
    <Layout>
      <LogoHeader />
      <Content style={{ padding: 16 }}>
        {loading ? (
          <Spin />
        ) : (
          <Row gutter={16}>
            <Col span={8}>
              <h2>Targets:</h2>
              <Menu
                onClick={({ item, key }) => {
                  let win = window.open(
                    PATH_PREFIX + "/items/" + key,
                    "_blank"
                  );
                  win.focus();
                  return;
                }}
                selectable={false}
                mode="vertical"
              >
                {data.map((item) => (
                  <Menu.Item key={item["o:id"]}>
                    {item["o:title"] ? item["o:title"] : "[Untitled]"}
                  </Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col span={16}>
              <NoteInput targets={data} />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default NoteView;
