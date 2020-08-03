import React, { useState, useEffect } from "react";
import { Divider, Row, Col, Spin, Button, Affix, Popover, Slider } from "antd";
import { useParams } from "react-router-dom";
import ImageView from "../components/ImageView";
import Metadata from "../components/Metadata";
import ItemBreadcrumb from "../components/ItemBreadcrumb";
import { useCookies } from "react-cookie";
import { getItem, getMediaInItem, PATH_PREFIX } from "../utils/Utils";
import AddNoteButton from "../components/AddNoteButton";
import AddToProjectModal from "../components/AddToProjectModal";
import NewProjectModal from "../components/NewProjectModal";
import NoteInput from "../components/NoteInput";
import { PlusOutlined } from "@ant-design/icons";

const colCounts = {};
[4, 6, 8, 12, 16, 18, 20].forEach((value, i) => {
  colCounts[i] = value;
});

//itemId
const ItemView = (props) => {
  let { itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [modalsVisible, setModalsVisible] = useState(0);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [data, setData] = useState([]);
  const [media, setMedia] = useState([]);
  const [cookies] = useCookies(["userInfo"]);
  const [colCountKey, setColCountKey] = useState(4);

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
        itemTitle={data["o:title"] ? data["o:title"] : "[Untitled]"}
      />
      <Divider>{data["o:title"] ? data["o:title"] : "[Untitled]"}</Divider>

      {mediaLoading ? (
        <Spin />
      ) : containMedia ? (
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
            <Row gutter={[16, 24]}>
              <Col span={24}>
                <div
                  id={"image-view-container-" + itemId}
                  className="image-view-container"
                  style={{ height: "100vh" }}
                />
                <ImageView dataSource={media} containerId={itemId} />
              </Col>
              <Row gutter={16}>
                <Col flex="auto">
                  <Button
                    onClick={() => {
                      const win = window.open(
                        "http://" +
                          cookies.userInfo.host +
                          "/item/" +
                          itemId +
                          "/play",
                        "_blank"
                      );
                      if (win != null) {
                        win.focus();
                      }
                    }}
                  >
                    Go to Universal Viewer
                  </Button>
                </Col>
                <Col flex="auto">
                  <Button
                    type="primary"
                    onClick={() => {
                      const win = window.open(
                        PATH_PREFIX +
                          "/media/" +
                          JSON.stringify(media.map((each) => each["o:id"]))
                      );
                      if (win != null) {
                        win.focus();
                      }
                    }}
                  >
                    Transcript All
                  </Button>
                </Col>
              </Row>
            </Row>
          </Col>
          <Col span={24 - colCounts[colCountKey]}>
            <Metadata dataSource={data} />
          </Col>
        </Row>
      ) : (
        <Row gutter={16}>
          <Col span={24}>
            <Metadata dataSource={data} />
          </Col>
        </Row>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ margin: "5px" }}>
          <Button
            onClick={() => {
              const win = window.open(
                "http://" +
                  cookies.userInfo.host +
                  "/admin/item/" +
                  itemId +
                  "/edit",
                "_blank"
              );
              if (win != null) {
                win.focus();
              }
            }}
          >
            Go to Edit Page
          </Button>
        </div>
        <div style={{ margin: "5px" }}>
          <AddNoteButton targets={[itemId]} />
        </div>
        <div style={{ margin: "5px" }}>
          <Button onClick={() => setModalsVisible(2)}>Add to Project</Button>
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ position: "fixed", bottom: "16px", right: "16px" }}>
          <Affix offsetBottom={0}>
            <Popover
              placement="topRight"
              trigger="click"
              content={<NoteInput targets={[data]} />}
            >
              <Button shape="circle" size="large" type="primary">
                <PlusOutlined />
              </Button>
            </Popover>
          </Affix>
        </div>
      </div>
    </>
  );
};

export default ItemView;
