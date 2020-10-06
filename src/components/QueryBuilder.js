import React, { useEffect, useState } from "react";
import { Select, Input } from "antd";
const { Option } = Select;

const QueryBuilder = (props) => {
  const [fields, setFields] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    setFilters(
      fields.map((field) => (
        <Input
          key={field}
          placeholder="press Enter to query"
          addonBefore={field}
          onPressEnter={(e) => console.log(e.target.value)}
        />
      ))
    );
  }, [fields]);

  const select = (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={fields}
      onChange={setFields}
    >
      <Option value="charles">Charles</Option>
      <Option value="miles">Miles</Option>
      <Option value="olson">Olson</Option>
    </Select>
  );

  //   const filters = (
  //     <Row gutter={[16, 16]}>
  //       <Col span={6}>
  //         <div style={{ marginBottom: 16 }}>
  //           <Input addonBefore="http://" defaultValue="foobar" />
  //         </div>
  //       </Col>
  //     </Row>
  //   );

  return (
    <>
      {select}
      {filters}
    </>
  );
};

export default QueryBuilder;
