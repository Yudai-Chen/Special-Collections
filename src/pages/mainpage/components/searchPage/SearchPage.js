import React, { Component } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Spin,
  Tabs,
  Menu,
  Dropdown,
  Select,
  Row,
  Col,
} from "antd";
import Datalist from "../dataList/DataList";
import Filmstrip from "../filmstrip/Filmstrip";
import {
  TableOutlined,
  VideoCameraAddOutlined,
  DownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Option } = Select;
const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default class MainPage extends Component {
  state = {
    selectedFiles: [],
    rowRecord: {},
    projects: [],
    templates: [],
    activeTemplate: 0,
    loading: false,
    menuLoading: false,
    templateName: "Select a template",
    properties: [],
    classList: [],
    projectList: [],
    projectLoading: false,
    classLoading: false,
    results: [],
  };

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.loadTemplateList();
    this.loadProjectList();
    this.loadClassList();
  }

  loadTemplateList = () => {
    this.setState({ loading: true });
    axios.get("/api/resource_templates").then((response) => {
      let templates = response.data.map((each) => ({
        id: each["o:id"],
        title: each["o:label"],
        properties: each["o:resource_template_property"],
      }));
      this.setState({ templates });
      this.setState({ loading: false });
    });
  };

  loadProjectList = () => {
    this.setState({ projectLoading: true });
    axios.get("/api/item_sets").then((response) => {
      let item_sets = response.data.map((each) => ({
        id: each["o:id"],
        title: each["o:title"],
      }));
      this.setState({ projectList: item_sets });
      this.setState({ projectLoading: false });
    });
  };

  loadClassList = () => {
    this.setState({ classLoading: true });
    axios.get("/api/resource_classes?per_page=1000").then((response) => {
      let classes = response.data.map((each) => ({
        id: each["o:id"],
        title: each["o:label"],
      }));
      this.setState({ classList: classes });
      this.setState({ classLoading: false });
    });
  };

  onRowClick = (record) => {
    this.setState({ rowRecord: record });
  };

  onCreateProject = (project) => {
    let data = this.state.projects;
    data.push(project);
    this.setState({ projects: data });
  };

  onUpdateProjects = (newProjects) => {
    this.setState({ projects: newProjects });
  };

  onMenuClick = ({ key }) => {
    try {
      this.setState({ menuLoading: true });
      let requests = this.state.templates[key]["properties"].map((each) => {
        return axios.get("/api/properties/" + each["o:property"]["o:id"]);
      });
      axios.all(requests).then(
        axios.spread((...responses) => {
          let properties = responses.map((each) => {
            return { id: each.data["o:id"], title: each.data["o:local_name"] };
          });
          this.setState({
            templateName: this.state.templates[key]["title"],
            activeTemplate: key,
            menuLoading: false,
            properties: properties,
          });
        })
      );
      this.setState({});
    } catch (error) {}
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  onFinish = (values) => {
    console.log(values);
    // let property = values["property-list"].map((each) => {"property["+});
    axios
      .get("/api/items", {
        params: {
          fulltext_search: "",
          property: [
            {
              joiner: "and",
              property: 1,
              type: "in",
              text: "test",
            },
          ],
          "property[0][joiner]": "and",
          "property[0][property]": 1,
          "property[0][type]": "in",
          "property[0][text]": "test",
          item_set_id: 150066,
        },
      })
      .then(
        (response) => {
          console.log(response.data);
          let results = response.data.map((each) => each["o:id"]);
          this.setState({ results });
        },
        () => {
          console.log("error");
        }
      );
  };

  render() {
    let menu = (
      <Menu onClick={this.onMenuClick}>
        {this.state.loading ? (
          <Spin></Spin>
        ) : (
          this.state.templates.map((each, index) => (
            <Menu.Item key={index}>{each["title"]}</Menu.Item>
          ))
        )}
      </Menu>
    );
    return (
      <Row gutter={16}>
        <Col span={6}>
          <div>
            {this.state.menuLoading ? (
              <Spin></Spin>
            ) : (
              <Dropdown overlay={menu}>
                <a
                  className="template-list"
                  onClick={(e) => e.preventDefault()}
                >
                  {this.state.templateName} <DownOutlined />
                </a>
              </Dropdown>
            )}
          </div>
          <div>
            <Form
              {...layout}
              name="search-form"
              onFinish={this.onFinish}
              size={"small"}
              ref={this.formRef}
            >
              <Form.List name="property-list">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field, index) => (
                        <Space
                          key={field.key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="start"
                        >
                          <Form.Item {...field} label={"Property " + index}>
                            <Input.Group compact>
                              <Form.Item
                                {...field}
                                name={[field.name, "joiner"]}
                                fieldKey={[field.fieldKey, "joiner"]}
                                noStyle
                              >
                                <Select dplaceholder="joiner">
                                  <Option value="and">AND</Option>
                                  {field.key > 0 ? (
                                    <Option value="or">OR</Option>
                                  ) : null}
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
                                  {this.state.properties.map((each) => (
                                    <Option value={each["id"]}>
                                      {each["title"]}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                {...field}
                                name={[field.name, "type"]}
                                fieldKey={[field.fieldKey, "type"]}
                                noStyle
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
                          style={{ width: "60%" }}
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
                              {this.state.classLoading ? (
                                <Spin></Spin>
                              ) : (
                                this.state.classList.map((each) => (
                                  <Option value={each["id"]}>
                                    {each["title"]}
                                  </Option>
                                ))
                              )}
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
                              {this.state.projectLoading ? (
                                <Spin></Spin>
                              ) : (
                                this.state.projectList.map((each) => (
                                  <Option value={each["id"]}>
                                    {each["title"]}
                                  </Option>
                                ))
                              )}
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
                <Button htmlType="button" onClick={this.onReset}>
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={18}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <TableOutlined />
                  List
                </span>
              }
              key="1"
            >
              <Datalist
                shownFiles={this.state.results}
                projects={this.state.projects}
                handleRowClick={this.onRowClick}
                handleCreateProject={this.onCreateProject}
                updataProjects={this.onUpdateProjects}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <VideoCameraAddOutlined />
                  Filmstrip
                </span>
              }
              key="2"
            >
              <Filmstrip shownFiles={this.state.selectedFiles} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}
