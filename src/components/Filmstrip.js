import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spin, Slider } from "antd";
import { PlaceHolder, getMedium } from "../utils/Utils";
import { useCookies } from "react-cookie";
const { Meta } = Card;
const colCounts = {};
[2, 3, 4, 6, 8, 12].forEach((value, i) => {
  colCounts[i] = value;
});
// item, baseAddress
const DisplayCard = (props) => {
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    if (!props.item["o:media"][0]) {
      setImg(<img alt="PlaceHolder" src={PlaceHolder} />);
    } else {
      getMedium(props.baseAddress, props.item["o:media"][0]["o:id"]).then(
        (response) => {
          setImg(
            <img
              alt={response.data["o:filename"]}
              src={response.data["o:thumbnail_urls"]["medium"]}
            />
          );
        }
      );
    }
  }, [props.baseAddress, props.item]);

  useEffect(() => {
    setLoading(false);
  }, [img]);

  return (
    <Card
      size="small"
      hoverable
      style={{ width: "90%" }}
      cover={img}
      bordered={false}
      loading={loading}
    >
      <Meta title={props.item["o:title"]} description={props.item["o:title"]} />
    </Card>
  );
};

// dataSource
const Filmstrip = (props) => {
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState([]);
  const [cookies] = useCookies(["userInfo"]);
  const [colCountKey, setColCountKey] = useState(4);

  useEffect(() => {
    setLoading(true);
    const colCount = colCounts[colCountKey];
    if (props.dataSource.length > 0) {
      let displayData = props.dataSource.map((item) => {
        return (
          <Col className="gutter-row" span={24 / colCount} key={item["o:id"]}>
            <DisplayCard item={item} baseAddress={cookies.userInfo.host} />
          </Col>
        );
      });

      let rowedData = [];
      for (let row = 0; row < (displayData.length - 1) / colCount + 1; row++) {
        rowedData.push(
          <Row gutter={[16, 24]} key={row}>
            {displayData.slice(row * colCount, row * colCount + colCount)}
          </Row>
        );
      }
      setDisplay(rowedData);
    } else {
      setDisplay([]);
    }
  }, [props.dataSource, cookies.userInfo, colCountKey]);

  useEffect(() => {
    setLoading(false);
  }, [display]);

  return loading ? (
    <Spin />
  ) : (
    <>
      <div style={{ width: "50%", marginBottom: 48 }}>
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
      </div>
      <div className="site-card-wrapper">{display}</div>
    </>
  );
};

export default Filmstrip;
