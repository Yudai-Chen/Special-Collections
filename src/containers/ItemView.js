import React, { useState, useEffect } from "react";
import { Divider, Row, Col, Spin } from "antd";
import { useParams } from "react-router-dom";
import ImageView from "../pages/ImageView";
import Metadata from "../components/Metadata";
import ItemBreadcrumb from "../components/ItemBreadcrumb";
import { useCookies } from "react-cookie";
import { getItem, getMediaInItem } from "../utils/Utils";

const ItemView = () => {
  const { itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [data, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    setLoading(true);
    getItem(cookies.userInfo.host, itemId).then((response) => {
      setData(response.data);
    });
    setMediaLoading(true);
    getMediaInItem(cookies.userInfo.host, itemId).then((response) => {
      setMedia(response.data);
      setMediaLoading(false);
    });
  }, [itemId, cookies.userInfo]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  const containMedia = media.length > 0;

  return loading ? (
    <Spin />
  ) : (
    <>
      <ItemBreadcrumb
        baseAddress={cookies.userInfo.host}
        itemId={itemId}
        itemTitle={data["o:title"]}
      />
      <Divider>{data["o:title"]}</Divider>
      <Row gutter={16}>
        {mediaLoading ? (
          <Spin />
        ) : containMedia ? (
          <Col span={8}>
            <ImageView dataSource={media} />
          </Col>
        ) : null}
        <Col span={containMedia ? 16 : 24}>
          <Metadata dataSource={data} />
        </Col>
      </Row>
    </>
  );
};

export default ItemView;
