import React, { Component } from "react";
import axios from "axios";
import { HOST_ADDRESS } from "../../Mainpage";
import Graph from "react-graph-vis";
export default class RelationGraph extends Component {
  state = { graph: { nodes: [], edges: [] } };
  constructor(props) {
    super(props);
    this.state.graph["nodes"].push({
      id: props.itemId,
      label: props.title,
      title: props.title,
    });
    this.buildGraph(props.itemId, 1, this.state.graph).then((res) => {
      this.setState({ graph: res });
    });
  }

  buildGraph = (itemId, depth, graph) => {
    if (depth == 0) {
      return graph;
    }

    return axios
      .get(HOST_ADDRESS + "/iiif/" + itemId + "/manifest")
      .then((response) => {
        let each = response.data.related;
        let ids = [];
        ids.push(
          parseInt(each["@id"].substring(each["@id"].lastIndexOf("/") + 1)),
          10
        );
        return ids;
      })
      .then((ids) => {
        let queryIds = "";
        ids.map((id) => {
          queryIds += id + ",";
        });
        return axios
          .get(HOST_ADDRESS + "/iiif/collection/" + queryIds)
          .then((response) => {
            response.data["manifests"].map((manifest) => {
              graph["nodes"].push({ id: ids[0], label: manifest["label"] });
              graph["edges"].push({ from: itemId, to: ids[0] });
            });
            graph = this.buildGraph(itemId, depth - 1, graph);
            return graph;
          });
      });
  };

  render() {
    const graph = {
      nodes: [
        { id: 1, label: "Node 1", title: "node 1 tootip text" },
        { id: 2, label: "Node 2", title: "node 2 tootip text" },
        { id: 3, label: "Node 3", title: "node 3 tootip text" },
        { id: 4, label: "Node 4", title: "node 4 tootip text" },
        { id: 5, label: "Node 5", title: "node 5 tootip text" },
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
      ],
    };

    const options = {
      layout: {
        hierarchical: true,
      },
      edges: {
        color: "#000000",
      },
      height: "200px",
    };

    const events = {
      select: function (event) {
        var { nodes, edges } = event;
      },
    };

    return (
      <Graph
        graph={this.state.graph}
        options={options}
        events={events}
        getNetwork={(network) => {}}
      />
    );
  }
}
