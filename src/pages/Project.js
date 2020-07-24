// import React, { Component } from "react";
// import Item from "./Item";
// import { Redirect, Route } from "react-router-dom";

// export default class Project extends Component {
//   state = {
//     itemId: undefined,
//   };

//   constructor(props) {
//     super(props);
//     let itemKey = props["shownFile"];
//     if (itemKey && itemKey[0]) {
//       let itemId;
//       if (itemKey[0].indexOf("-") != -1) {
//         itemId = itemKey[0].substring(
//           itemKey[0].indexOf("-") + 1,
//           itemKey[0].length
//         );
//       }
//       this.setState({ itemId });
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     let itemKey = nextProps["shownFile"];
//     if (itemKey && itemKey[0]) {
//       let itemId;
//       if (String(itemKey[0]).indexOf("-") != -1) {
//         itemId = itemKey[0].substring(
//           itemKey[0].indexOf("-") + 1,
//           itemKey[0].length
//         );
//         this.setState({ itemId: itemId });
//       } else {
//         this.setState({ itemId: undefined });
//       }
//     }
//   }

//   render() {
//     return this.state.itemId ? (
//       <div>
//         <Redirect push to={"/items/" + this.state.itemId} />
//         <Route path="/items/:itemId" component={Item} />
//       </div>
//     ) : null;
//   }
// }
