import React, { useState, useEffect } from "react";
import { Form, Spin, Input, Select, Space, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";
import TemplateDropdown from "./TemplateDropdown";
import axios from "axios";
import {
  getItemSetList,
  getPropertyList,
  getResourceClassList,
  searchItems,
  getPropertiesInResourceTemplate,
} from "../utils/Utils";

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

// handleSearchResults
const ItemSearchForm = (props) => {
  const [propertyList, setPropertyList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["userInfo"]);
  const [templateId, setTemplateId] = useState(0);
  const [propertyLoading, setPropertyLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let requests = [
      getItemSetList(cookies.userInfo.host).then((response) => {
        let classes = response.data.map((each) => ({
          id: each["o:id"],
          title: each["o:title"],
        }));
        setProjectList(classes);
      }),
      getPropertyList(cookies.userInfo.host).then((response) => {
        let classes = response.data.map((each) => ({
          id: each["o:id"],
          title: each["o:label"],
        }));
        setPropertyList(classes);
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
          })
        )
        .then(() => {
          setPropertyLoading(false);
        });
    }
  }, [templateId, cookies.userInfo]);

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
    searchItems(cookies.userInfo.host, params).then((response) => {
      let data = response.data.map((each) => ({
        ...each,
        key: each["o:id"],
      }));
      props.handleSearchResults(data);
    });
  };

  return loading ? (
    <Spin />
  ) : (
    <Space direction="vertical" size="middle">
      I only want to use properties in:
      <TemplateDropdown
        onMenuSelect={(templateId) => {
          setTemplateId(templateId);
        }}
      />
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
                        <Form.Item
                          {...field}
                          name={[field.name, "joiner"]}
                          fieldKey={[field.fieldKey, "joiner"]}
                          noStyle
                          initialValue="and"
                        >
                          <Select placeholder="joiner">
                            <Option value="and">AND</Option>
                            {index > 0 ? <Option value="or">OR</Option> : null}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, "property"]}
                          fieldKey={[field.fieldKey, "property"]}
                          noStyle
                        >
                          <Select
                            placeholder="[Any property]"
                            onChange={null}
                            allowClear
                          >
                            {propertyLoading ? (
                              <Spin />
                            ) : (
                              propertyList.map((each) => (
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
                            allowClear
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
                      </Input.Group>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
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
                      <Select
                        placeholder="Select a class"
                        onChange={null}
                        allowClear
                      >
                        {classList.map((each) => (
                          <Option value={each["id"]}>{each["title"]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: "0 8px" }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: "60%" }}
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
                      <Select
                        placeholder="Select a project"
                        onChange={null}
                        allowClear
                      >
                        {projectList.map((each) => (
                          <Option value={each["id"]}>{each["title"]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: "0 8px" }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: "60%" }}
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

export default ItemSearchForm;
