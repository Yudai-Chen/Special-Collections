import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import Graph from "react-graph-vis";
import { Spin, Layout, Dropdown, Menu, Space } from "antd";
import LogoHeader from "./LogoHeader";
import { PATH_PREFIX, getItem } from "../utils/Utils";
import { DownOutlined } from "@ant-design/icons";

const { Content } = Layout;

const splitToSeveralLines = (s, maxLen) => {
  let i = 0;
  let last = 0;
  let len = s.length;
  let res = "";
  while (i < len) {
    i += maxLen;
    res += s.slice(last, i);
    res += "\n";
    last = i;
  }
  return res;
};

const options = {
  autoResize: true,
  layout: {
    hierarchical: true,
  },
  interaction: { hover: true },
  edges: {
    arrows: {
      to: {
        enabled: false,
      },
    },
    color: "#000000",
  },
  nodes: {
    color: {
      background: "#ffffff",
    },
  },
  height: "1000px",
};

const events = {
  select: function (event) {
    var { nodes } = event;
    let win = window.open(PATH_PREFIX + "/items/" + nodes[0], "_blank");
    win.focus();
  },
};
// there are some issues in the last layer
const RelationGraph = () => {
  const { itemId } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [cookies] = useCookies(["userInfo"]);
  const centerId = itemId;
  const [layer, setLayer] = useState(3);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("dot");

  useEffect(() => {
    const buildGraph = async (itemId, depth, graph) => {
      if (depth === 0) {
        return graph;
      }
      setLoading(true);
      const response = await getItem(cookies.userInfo.host, itemId);
      let newNode = graph.nodes.find((item) => item.id === itemId);
      newNode.label = response.data["o:title"]
        ? response.data["o:title"].slice(0, 20)
        : "[Untitled]";
      newNode.title = response.data["o:title"]
        ? splitToSeveralLines(response.data["o:title"], 10)
        : "[Untitled]";
      newNode.group = response.data["o:resource_class"]
        ? response.data["o:resource_class"]["o:id"]
        : 0;
      let links = [];
      for (var property in response.data) {
        try {
          if (response.data[property][0]["type"] === "resource") {
            response.data[property].map((each) => {
              links.push(each);
              return each;
            });
          }
        } catch (error) {}
      }
      links.map(async (each_1) => {
        let test = graph.edges.find((item_1) => {
          return (
            String(item_1["to"]) === String(itemId) &&
            String(item_1["from"]) === String(each_1["value_resource_id"])
          );
        });

        if (!test) {
          graph.edges.push({
            from: String(itemId),
            to: String(each_1["value_resource_id"]),
          });
        }

        test = graph.nodes.find((item_2) => {
          return String(item_2.id) === String(each_1["value_resource_id"]);
        });
        if (!test) {
          graph.nodes.push({
            id: String(each_1["value_resource_id"]),
            level: depth - 1,
            shape: style,
            size: style === "dot" ? 5 : 25,
          });
          await buildGraph(
            String(each_1["value_resource_id"]),
            depth - 1,
            graph
          );
        }
      });
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setLoading(false);
      return graph;
    };

    const entry = async () => {
      setLoading(true);
      let graph = await buildGraph(centerId, layer, {
        nodes: [
          { id: String(centerId), shape: "star", size: 15, level: layer },
        ],
        edges: [],
      });
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setLoading(false);
    };

    entry();
  }, [centerId, layer, cookies.userInfo, style]);

  const sytleMenu = (
    <Menu onClick={({ key }) => setStyle(key)}>
      <Menu.Item key={"dot"}>dot</Menu.Item>
      <Menu.Item key={"box"}>box</Menu.Item>
    </Menu>
  );
  const layerMenu = (
    <Menu onClick={({ key }) => setLayer(key)}>
      {[1, 2, 3, 4, 5, 6].map((each) => (
        <Menu.Item key={each}>{each}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout>
      <LogoHeader />
      <Content>
        <Space direction="horizontal" size="middle">
          Style:
          <Dropdown overlay={sytleMenu} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {style} <DownOutlined />
            </a>
          </Dropdown>
          Layer:
          <Dropdown overlay={layerMenu} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {layer} <DownOutlined />
            </a>
          </Dropdown>
        </Space>
        {loading ? (
          <Spin></Spin>
        ) : (
          <Graph graph={{ nodes, edges }} options={options} events={events} />
        )}
      </Content>
    </Layout>
  );
};

export default RelationGraph;
