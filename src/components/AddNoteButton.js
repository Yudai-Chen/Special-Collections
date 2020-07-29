import React from "react";
import { Button } from "antd";
// TODO
// targets
const AddNoteButton = (props) => {
  const onNoteAdd = () => {
    // let data = this.state.selectedRows.map((each) => {
    //   return {
    //     key: each["itemId"],
    //     title: each["title"],
    //     isLeaf: true,
    //   };
    // });
    // openInNewWindow("/react/#/note/" + JSON.stringify(data));
  };
  return <Button onClick={onNoteAdd}>Add Note</Button>;
};

export default AddNoteButton;
