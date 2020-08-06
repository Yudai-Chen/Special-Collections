import React, { useState, useEffect } from "react";
import { Layout, Tabs, Divider, Space } from "antd";
import Preview from "../components/Preview";
import Datalist from "../components/DataList";
import Filmstrip from "../components/Filmstrip";
import Metadata from "../components/Metadata";
import Archive from "../components/Archive";
import ItemSearchForm from "../components/ItemSearchForm";
import MediumSearchForm from "../components/MediumSearchForm";
import TemplateDropdown from "../components/TemplateDropdown";

import {
  TableOutlined,
  VideoCameraAddOutlined,
  SearchOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  getItems,
  getPropertyList,
  getPropertiesInResourceTemplate,
} from "../utils/Utils";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const Home = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [rowRecord, setRowRecord] = useState({});
  const [cookies] = useCookies(["userInfo"]);
  const [dataLoading, setDataLoading] = useState(false);
  const [hasMediaData, setHasMediaData] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [templateId, setTemplateId] = useState(0);
  const [propertyList, setPropertyList] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);

  const onArchiveCheck = (keys) => {
    if (keys.length > 0) {
      setDataLoading(true);
      getItems(cookies.userInfo.host, keys)
        .then(
          axios.spread((...responses) => {
            let data = responses
              .filter((each) => !each.data["dcterms:hasPart"])
              .map((each) => ({ ...each.data, key: each.data["o:id"] }));
            setSelectedItems(data);
            setDataLoading(false);
          })
        )
        .catch((errors) => {});
    } else {
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    setPropertyLoading(true);
    if (templateId === 0) {
      getPropertyList(cookies.userInfo.host)
        .then((response) => {
          let classes = response.data.map((each) => ({
            id: each["o:id"],
            title: each["o:label"],
          }));
          setPropertyList(classes);
          let propertyData = response.data.map((each) => ({
            "o:term": each["o:term"],
            "o:label": each["o:label"],
          }));
          setSelectedProperties(propertyData);
        })
        .then(() => setPropertyLoading(false));
    } else {
      getPropertiesInResourceTemplate(cookies.userInfo.host, templateId)
        .then(
          axios.spread((...responses) => {
            let properties = responses.map((each) => ({
              id: each.data["o:id"],
              title: each.data["o:label"],
            }));
            setPropertyList(properties);
            let propertyData = responses.map((each) => ({
              "o:term": each.data["o:term"],
              "o:label": each.data["o:label"],
            }));
            setSelectedProperties(propertyData);
          })
        )
        .then(() => {
          setPropertyLoading(false);
        });
    }
  }, [templateId, cookies.userInfo]);

  return (
    <Layout
      style={{
        background: "#FFF",
      }}
    >
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          width: "280",
          padding: 24,
        }}
        width="280"
        theme="light"
      >
        <Space direction="vertical" size="middle">
          I only want to use properties in:
          <TemplateDropdown
            onMenuSelect={(templateId) => {
              setTemplateId(templateId);
            }}
          />
        </Space>
        <Tabs defaultActiveKey={1}>
          <TabPane
            tab={
              <span>
                <ApartmentOutlined />
                Tree
              </span>
            }
            key={1}
          >
            <div>
              <Archive
                updateSelectedItems={(keys) => {
                  onArchiveCheck(keys);
                }}
              />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <SearchOutlined />
                Search
              </span>
            }
            key={2}
          >
            <ItemSearchForm
              handleSearchResults={(items) => {
                setSelectedItems(items);
                setHasMediaData(false);
              }}
              propertyList={propertyList}
              propertyLoading={propertyLoading}
            />
            <MediumSearchForm
              handleSearchResults={(items) => {
                setSelectedItems(items);
                setHasMediaData(true);
              }}
            />
          </TabPane>
        </Tabs>
      </Sider>
      <Layout style={{ padding: 24 }}>
        <Content>
          <Tabs defaultActiveKey={1}>
            <TabPane
              tab={
                <span>
                  <TableOutlined />
                  List
                </span>
              }
              key={1}
            >
              <Datalist
                selectedProperties={selectedProperties}
                hasMediaData={hasMediaData}
                dataSource={selectedItems}
                handleRowClick={(record) => {
                  setRowRecord(record);
                }}
                loading={dataLoading}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <VideoCameraAddOutlined />
                  Card
                </span>
              }
              key={2}
            >
              <Filmstrip dataSource={selectedItems} />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
      <Sider theme="light" collapsible={false} style={{ padding: 10 }}>
        <Preview dataSource={rowRecord} displayNum={5} />
        <Divider style={{ height: "20" }} />
        <Metadata dataSource={rowRecord} />
      </Sider>
    </Layout>
  );
};

export default Home;
