import React, { useState, useEffect } from "react";
import { Form, Spin, Input, Select, Space, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";
import {
  getItemSetList,
  getResourceClassList,
  searchItems,
} from "../utils/Utils";

import { connect } from "react-redux";
import { setQuery } from "../redux/actions";
import { fetchSize } from "../utils/OmekaS";

const { Option } = Select;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

// handleSearchResults, propertyList, propertyLoading
const ItemSearchForm = (props) => {
  const [classList, setClassList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    setLoading(true);
    let requests = [
      getItemSetList(cookies.userInfo.host).then((response) => {
        let classes = response.data.map((each) => ({
          id: each["o:id"],
          title: each["o:title"] ? each["o:title"] : "[Untitled]",
        }));
        setProjectList(classes);
      }),

      getResourceClassList(cookies.userInfo.host).then((response) => {
        let classes = response.data.map((each) => ({
          id: each["o:id"],
          title: each["o:label"],
        }));
        setClassList(classes);
      }),
    ];
    Promise.all(requests).then(() => setLoading(false));
  }, [cookies.userInfo]);

  const formRef = React.createRef();
  const onReset = () => {
    formRef.current.resetFields();
  };

  const onFinish = (values) => {
    let params = { fulltext_search: "" };
    if (values["property-list"]) {
      values["property-list"]
        .filter((each) => each !== undefined)
        .map((each, index) => {
          params["property[" + index + "][joiner]"] = each["joiner"];
          params["property[" + index + "][property]"] = each["property"];
          params["property[" + index + "][type]"] = each["type"];
          params["property[" + index + "][text]"] = each["key"];
          console.log(params)
          return each;
        });
    }
    if (values["project"]) {
      values["project"]
        .filter((each) => each !== undefined)
        .map((each, index) => {
          params["item_set_id[" + index + "]"] = each;
          return each;
        });
    }
    if (values["class"]) {
      values["class"]
        .filter((each) => each !== undefined)
        .map((each, index) => {
          params["resource_class_id[" + index + "]"] = each;
          return each;
        });
    }

    // START: cool zone
    fetchSize(cookies.userInfo.host, "items", params).then((count) =>
      props.setQuery("items", params, count)
    );
    // END: cool zone

    // searchItems(cookies.userInfo.host, params).then((response) => {
    //   let data = response.data.map((each) => ({
    //     ...each,
    //     key: each["o:id"],
    //   }));
    //   props.handleSearchResults(data);
    // });
  };

  return loading ? (
    <Spin />
  ) : (
    <Space direction="vertical" size="middle">
      <Form
        {...layout}
        name="search-form"
        onFinish={onFinish}
        size={"small"}
        ref={formRef}
      >
        <Form.List name="property-list">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Space
                    key={index}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="start"
                  >
                    <Form.Item {...field} label={"Property " + index}>
                      <Input.Group compact>
                        <Space direction="vertical" size="small">
                          <Form.Item
                            {...field}
                            name={[field.name, "joiner"]}
                            fieldKey={[field.fieldKey, "joiner"]}
                            noStyle
                            initialValue="and"
                          >
                            <Select placeholder="joiner">
                              <Option value="and">AND</Option>
                              {index > 0 ? (
                                <Option value="or">OR</Option>
                              ) : null}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...field}
                            name={[field.name, "property"]}
                            fieldKey={[field.fieldKey, "property"]}
                            noStyle
                            initialValue={1}
                          >
                            <Select
                              placeholder="[Any property]"
                              onChange={null}
                            >
                              {props.propertyLoading ? (
                                <Spin />
                              ) : (
                                props.propertyList.map((each) => (
                                  <Option value={each["id"]}>
                                    {each["title"]}
                                  </Option>
                                ))
                              )}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...field}
                            name={[field.name, "type"]}
                            fieldKey={[field.fieldKey, "type"]}
                            noStyle
                            initialValue="in"
                          >
                            <Select
                              placeholder="[Any relation]"
                              onChange={null}
                            >
                              <Option value="eq">is exactly</Option>
                              <Option value="neq">is not exactly</Option>
                              <Option value="in">contains</Option>
                              <Option value="nin">does not contain</Option>
                              <Option value="ex">has any value</Option>
                              <Option value="nex">has no value</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "key"]}
                            fieldKey={[field.fieldKey, "key"]}
                            noStyle
                          >
                            <Input placeholder="key" />
                          </Form.Item>
                        </Space>
                      </Input.Group>
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined /> Add property
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Form.List name="class">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item label={"Class " + index} key={field.key}>
                    <Form.Item {...field} noStyle>
                      <Select placeholder="Select a class" onChange={null}>
                        {classList.map((each) => (
                          <Option value={each["id"]}>{each["title"]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined /> Add class
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Form.List name="project">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item label={"Project " + index} key={field.key}>
                    <Form.Item {...field} noStyle>
                      <Select placeholder="Select a project" onChange={null}>
                        {projectList.map((each) => (
                          <Option value={each["id"]}>{each["title"]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined /> Add project
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default connect(null, { setQuery })(ItemSearchForm);
