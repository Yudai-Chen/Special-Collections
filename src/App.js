import React, { Component } from "react";
import TreeView from "react-treeview";
import axios from "axios";

// This example data format is totally arbitrary. No data massaging is
// required and you use regular js in `render` to iterate through and
// construct your nodes.
const dataSource = [
  ["Apple", "Orange"],
  ["Facebook", "Google"],
  ["Celery", "Cheeseburger"],
];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsedBookkeeping: dataSource.map(() => false),
    };
    this.handleClick = this.handleClick.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  handleClick(i) {
    let [...collapsedBookkeeping] = this.state.collapsedBookkeeping;
    collapsedBookkeeping[i] = !collapsedBookkeeping[i];
    this.setState({ collapsedBookkeeping: collapsedBookkeeping });
  }

  collapseAll() {
    this.setState({
      collapsedBookkeeping: this.state.collapsedBookkeeping.map(() => true),
    });
  }

  async getDataAxios() {
    const response = await axios.get(
      "http://jsonplaceholder.typicode.com/users"
    );
    console.log(response.data);
  }

  render() {
    this.getDataAxios();
    const collapsedBookkeeping = this.state.collapsedBookkeeping;
    return (
      <div>
        <button onClick={this.collapseAll}>Collapse all</button>
        {dataSource.map((node, i) => {
          // Let's make it so that the tree also toggles when we click the
          // label. Controlled components make this effortless.
          const label = (
            <span className="node" onClick={this.handleClick.bind(null, i)}>
              Type {i}
            </span>
          );
          return (
            <TreeView
              key={i}
              nodeLabel={label}
              collapsed={collapsedBookkeeping[i]}
              onClick={this.handleClick.bind(null, i)}
            >
              {node.map((entry) => (
                <div className="info" key={entry}>
                  {entry}
                </div>
              ))}
            </TreeView>
          );
        })}
      </div>
    );
  }
}
