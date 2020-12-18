import React from "react";
import { Button } from "antd";
import { PATH_PREFIX } from "../utils/Utils";
// targets
const AddNoteButton = (props) => {
  const onNoteAdd = () => {
    let data = props.targets
      .filter((each) => each !== undefined)
      .map((each) => parseInt(each));
    let win = window.open(
      PATH_PREFIX + "/note/" + JSON.stringify(data),
      "_blank"
    );
    win.focus();
  };
  return <Button onClick={onNoteAdd}>Add Note</Button>;
};

export default AddNoteButton;
