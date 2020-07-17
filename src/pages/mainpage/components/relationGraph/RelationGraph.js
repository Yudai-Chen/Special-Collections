import React, { Component } from "react";
import axios from "axios";
import { HOST_ADDRESS } from "../../Mainpage";
import Graph from "react-graph-vis";
import { Spin } from "antd";

export default class RelationGraph extends Component {
  state = { graph: { nodes: [], edges: [] }, loading: false };
  constructor(props) {
    super(props);
    this.state.graph["nodes"].push({
      id: props.itemId,
      label: this.splitToSeveralLines(props.title, 10),
      title: props.title,
    });
    this.buildGraph(props.itemId, 4, this.state.graph);
  }

  splitToSeveralLines = (s, maxLen) => {
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

  buildGraph = (itemId, depth, graph) => {
    if (depth == 0) {
      return graph;
    }
    this.setState({ loading: true });
    return axios.get(HOST_ADDRESS + "/api/items/" + itemId).then((response) => {
      let exist = graph["nodes"].find((each) => {
        return each["id"] == itemId;
      });
      if (exist && exist != -1) {
        exist["group"] = response.data["o:resource_class"]
          ? response.data["o:resource_class"]["o:id"]
          : 0;
      }
      let links = [];
      for (var property in response.data) {
        try {
          if (response.data[property][0]["type"] == "resource") {
            response.data[property].map((each) => {
              links.push(each);
            });
          }
        } catch (error) { }
      }
      links.map(async (each) => {
        let test = graph["nodes"].find((item) => {
          return item["id"] == each["value_resource_id"];
        });
        if (!test || test == -1) {
          graph["nodes"].push({
            id: each["value_resource_id"],
            label: this.splitToSeveralLines(each["display_title"], 10),
            titel: each["display_title"],
          });
        }
        test = graph["edges"].find((item) => {
          return (
            item["to"] == itemId && item["from"] == each["value_resource_id"]
          );
        });
        if (!test || test == -1) {
          graph["edges"].push({ from: itemId, to: each["value_resource_id"] });
          graph = await this.buildGraph(
            each["value_resource_id"],
            depth - 1,
            graph
          );
        }
      });

      this.setState({ graph: graph, loading: false });
    });
  };

  render() {
    const options = {
      autoResize: true,
      layout: {
        hierarchical: true,
      },
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
        shape: "box",
      },
      height: "1000px",
    };

    const events = {
      select: function (event) {
        var { nodes, edges } = event;
        window.open("#/items/" + nodes[0]);
      },
    };

    return this.state.loading ? (
      <Spin></Spin>
    ) : (
        <div height="1000">
          <Graph
            graph={this.state.graph}
            options={options}
            events={events}
            getNetwork={(network) => { }}
          />
        </div>
      );
  }
}
