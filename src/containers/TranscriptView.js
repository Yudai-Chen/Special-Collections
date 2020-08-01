import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spin, Slider, Input, Button } from "antd";
import { ExpandOutlined } from "@ant-design/icons";
import Viewer from "react-viewer";
import { useCookies } from "react-cookie";
import { PlaceHolder, getMedia } from "../utils/Utils";
import axios from "axios";

const { TextArea } = Input;

const colCounts = {};
[4, 6, 8, 12, 16, 18, 20].forEach((value, i) => {
  colCounts[i] = value;
});

// TODO
const TranscriptView = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [colCountKey, setColCountKey] = useState(4);
  const [cookies] = useCookies(["userInfo"]);
  const [inline, setInline] = useState(true);
  const { mediaList } = useParams();
  const container = useRef(null);

  useEffect(() => {
    setLoading(true);
    let media = JSON.parse(mediaList);
    getMedia(cookies.userInfo.host, media)
      .then(
        axios.spread((...responses) => {
          let data = responses.map((each) => each.data);
          setData(data);
        })
      )
      .then(() => {
        setLoading(false);
      });
  }, [cookies.userInfo, mediaList]);

  return (
    <Row gutter={16}>
      <Col span={12}>
        Width:
        <Slider
          min={0}
          max={Object.keys(colCounts).length - 1}
          value={colCountKey}
          onChange={(colCountKey) => {
            setColCountKey(colCountKey);
          }}
          marks={colCounts}
          step={null}
          tipFormatter={(value) => colCounts[value]}
        />
      </Col>
      <Col span={12}></Col>
      <Col span={colCounts[colCountKey]}>
        <div
          className="image-view-container"
          style={{ height: "100vh" }}
          ref={container}
        />
        {loading ? (
          <Spin />
        ) : (
          <Viewer
            zIndex={0}
            visible={true}
            noClose={inline}
            container={inline ? container.current : null}
            downloadable={true}
            downloadInNewWindow={true}
            images={data.map((each) => ({
              key: each["o:id"],
              src: each["o:original_url"],
              alt: each["o:title"],
              downloadUrl: each["o:original_url"],
            }))}
            activeIndex={activeKey}
            defaultScale={1.5}
            defaultImg={<img src={PlaceHolder} alt="PlaceHolder" />}
            noImgDetails={true}
            attribute={false}
            onChange={(activeImage, index) => {
              setActiveKey(index);
            }}
            onClose={() => {
              setInline(true);
            }}
            customToolbar={(toolbars) => {
              return toolbars.concat([
                {
                  key: "expand",
                  render: <ExpandOutlined />,
                  onClick: () => setInline(false),
                },
              ]);
            }}
            zoomSpeed={0.1}
          />
        )}
      </Col>
      <Col span={24 - colCounts[colCountKey]}>
        {loading ? (
          <Spin />
        ) : (
          <Row gutter={[16, 24]}>
            <Col span={24}>
              <TextArea
                value={
                  data[activeKey]["bibo:transcriptOf"]
                    ? data[activeKey]["bibo:transcriptOf"][0]["@value"]
                    : ""
                }
                onChange={null}
                autoSize={{ minRows: 42, maxRows: 42 }}
              />
            </Col>
            <Col span={12} offset={12}>
              <Row gutter={16}>
                <Col flex="auto">
                  <Button type="primary" danger>
                    Discard Change
                  </Button>
                </Col>
                <Col flex="auto">
                  <Button>Next</Button>
                </Col>
                <Col flex="auto">
                  <Button type="primary">Submit</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};
export default TranscriptView;
