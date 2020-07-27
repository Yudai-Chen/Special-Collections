import React, { useState } from "react";
import { Layout, Tabs, Divider } from "antd";
import Preview from "../components/Preview";
import Datalist from "../components/DataList";
import Filmstrip from "../components/Filmstrip";
import Metadata from "../components/Metadata";
import Archive from "../components/Archive";
import ItemSearchForm from "../components/ItemSearchForm";
import MediumSearchForm from "../components/MediumSearchForm";

import {
  TableOutlined,
  VideoCameraAddOutlined,
  SearchOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
import axios from "axios";
import { getItems } from "../utils/Utils";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const Home = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [rowRecord, setRowRecord] = useState({});
  const [cookies] = useCookies(["userInfo"]);
  const [dataLoading, setDataLoading] = useState(false);

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

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          width: "280",
          left: 0,
        }}
        width="280"
        theme="light"
      >
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
              }}
            />
            <MediumSearchForm />
          </TabPane>
        </Tabs>
      </Sider>
      <Layout>
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
                hasMediaData={false}
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
        <Sider theme="light" collapsible={false}>
          <Preview dataSource={rowRecord} displayNum={5} />
          <Divider style={{ height: "20" }} />
          <Metadata dataSource={rowRecord} />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default Home;
