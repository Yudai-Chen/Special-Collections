import React from "react";
import { Table } from "antd";

// dataSource
const columns = [
  {
    title: "Label",
    dataIndex: "label",
    width: "30%",
  },
  {
    title: "Value",
    dataIndex: "value",
    width: "70%",
  },
];

const Metadata = (props) => {
  return <Table columns={columns} dataSource={[props.dataSource]} />;
};

export default Metadata;
