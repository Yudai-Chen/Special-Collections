import React, { useState, useEffect } from "react";
import axios from "axios";
import { Space, Carousel, Spin } from "antd";
import { PlaceHolder, getMedia } from "../utils/Utils";
import { useCookies } from "react-cookie";
// TODO: make displayNum a dropdown list
//dataSource, displayNum
const Preview = (props) => {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    setLoading(true);
    if (props.dataSource && props.dataSource["o:media"]) {
      let media = props.dataSource["o:media"]
        .slice(0, props.displayNum)
        .map((each) => each["o:id"]);
      getMedia(cookies.userInfo.host, media).then(
        axios.spread((...responses) => {
          setMedia(responses.map((each) => each.data));
        })
      );
    } else {
      setMedia([]);
    }
  }, [props.dataSource, cookies.userInfo, props.displayNum]);

  useEffect(() => {
    setLoading(false);
  }, [media]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div align="center">
        <div className="ant-descriptions-title">Preview</div>
        <Carousel autoplay>
          {loading ? (
            <Spin />
          ) : media.length > 0 ? (
            media.map((each, index) => {
              return (
                <div key={index}>
                  <img
                    src={each["o:thumbnail_urls"]["square"]}
                    alt={each["dcterms:title"]["@value"]}
                    height="200"
                    width="200"
                  />
                  <p>{each["dcterms:title"]["@value"]}</p>
                </div>
              );
            })
          ) : (
            <img
              src={PlaceHolder}
              alt={"PlaceHolder"}
              height="200"
              width="200"
            />
          )}
        </Carousel>
        <p>
          {props.dataSource["o:id"]
            ? props.dataSource["o:title"]
              ? props.dataSource["o:title"]
              : "[Untitled]"
            : "No Item"}
        </p>
      </div>
    </Space>
  );
};

export default Preview;
