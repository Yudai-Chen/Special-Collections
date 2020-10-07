import React, { useEffect, useState } from "react";
import QueryBuilder from "../components/QueryBuilder";
import { Layout, Tabs, Divider, Space } from "antd";
import { useCookies } from "react-cookie";

import { TableOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import TableView from "../components/TableView";
import { getPropertyList } from "../utils/Utils";

const { TabPane } = Tabs;

const Explorer = (props) => {
  const [cookies] = useCookies(["userInfo"]);
  const [tableColumns, setTableColumns] = useState([
    // {
    //   title: "ID",
    //   dataIndex: "o:id",
    //   sorter: {
    //     compare: (a, b) => (a["o:id"] ?? 0) - (b["o:id"] ?? 0),
    //   },
    //   width: 100,
    //   active: true,
    // },
    // {
    //   title: "Title",
    //   dataIndex: "o:title",
    //   sorter: {
    //     compare: (a, b) =>
    //       (a["o:title"] ?? "").localeCompare(b["o:title"] ?? ""),
    //   },
    //   ellipsis: true,
    //   width: 200,
    //   active: true,
    // },
  ]);

  useEffect(() => {
    getPropertyList(cookies.userInfo.host).then(res => {
      console.log("jhere")
  
      const cols = res.data.map(property => ({
        id: property["o:id"],
        title: property["o:label"],
        dataIndex: "o:" +  property["o:local_name"],
        // sorter
        width: 100,
        active: false,
      }));
  
      setTableColumns(cols);
    })
  }, []);


  return (
    <>
      <QueryBuilder
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
      />
      <Tabs defaultActiveKey={1}>
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Table
            </span>
          }
          key={1}
        >
          <TableView
            columns={tableColumns.filter((col) => col.active === true)}
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
          <h1>Cards</h1>
        </TabPane>
      </Tabs>
    </>
  );
};

export default Explorer;
