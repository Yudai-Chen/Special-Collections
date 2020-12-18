import React, { useState, useEffect } from "react";
import NoteInput from "../components/NoteInput";
import { useParams, Link } from "react-router-dom";
import { getItems, PATH_PREFIX } from "../utils/Utils";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Spin, Row, Col, Layout, Table, Space, Popconfirm } from "antd";
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
        let data = responses.map((each) => ({
          key: each.data["o:id"],
          ...each.data,
        }));
        setData(data);
      })
    );
  }, [cookies.userInfo, targetList]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  const handleRemove = (itemId) => {
    setData((data) => data.filter((item) => item["o:id"] !== itemId));
  };

  let columns = [
    {
      title: "Title",
      dataIndex: "o:title",
      render: (text, record) =>
        record["o:title"] ? record["o:title"] : "[Untitled]",
      sorter: {
        compare: (a, b) => a["o:title"].localeCompare(b["o:title"]),
      },
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={PATH_PREFIX + "/items/" + record["o:id"]} target="_balnk">
            View
          </Link>
          {data.length >= 1 ? (
            <Popconfirm
              title="Sure to remove it from targets?"
              onConfirm={() => handleRemove(record["o:id"])}
            >
              <a>Remove</a>
            </Popconfirm>
          ) : null}
        </Space>
      ),
      width: 200,
    },
  ];

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
              <Table columns={columns} dataSource={data} showHeader={false} />
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
