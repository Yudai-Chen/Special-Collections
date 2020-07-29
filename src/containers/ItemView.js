import React, { useState, useEffect } from "react";
import { Divider, Row, Col, Spin, Button } from "antd";
import { useParams } from "react-router-dom";
import ImageView from "../components/ImageView";
import Metadata from "../components/Metadata";
import ItemBreadcrumb from "../components/ItemBreadcrumb";
import { useCookies } from "react-cookie";
import { getItem, getMediaInItem } from "../utils/Utils";
import AddNoteButton from "../components/AddNoteButton";
import AddToProjectModal from "../components/AddToProjectModal";
import NewProjectModal from "../components/NewProjectModal";

//itemId
const ItemView = (props) => {
  let { itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [modalsVisible, setModalsVisible] = useState(0);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [data, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const [cookies] = useCookies(["userInfo"]);

  if (itemId === undefined) itemId = props.itemId;

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
            <div
              id={"image-view-container-" + itemId}
              className="image-view-container"
            />
            <ImageView dataSource={media} />
          </Col>
        ) : null}
        <Col span={containMedia ? 16 : 24}>
          <Metadata dataSource={data} />
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ margin: "5px" }}>
          <AddNoteButton targets={[itemId]} />
        </div>
        <div style={{ margin: "5px" }}>
          <Button onClick={() => setModalsVisible(2)}>Add To Project</Button>
        </div>
        <div style={{ margin: "5px" }}>
          <Button type="primary" onClick={() => setModalsVisible(1)}>
            Create Project
          </Button>
        </div>
      </div>
      <NewProjectModal
        visible={modalsVisible === 1}
        selectedRowKeys={[itemId]}
        onClose={() => setModalsVisible(0)}
      />
      <AddToProjectModal
        visible={modalsVisible === 2}
        selectedRowKeys={[itemId]}
        onClose={() => setModalsVisible(0)}
      />
    </>
  );
};

export default ItemView;
