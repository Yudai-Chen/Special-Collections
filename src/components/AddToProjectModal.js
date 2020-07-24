import React, { useState } from "react";
import { Modal } from "antd";
import { addItemsToItemSet } from "../utils/Utils";
import { useCookies } from "react-cookie";
import ProjectListMenu from "./ProjectListMenu";

// visible, selectedRowKeys
const AddToProjectModal = (props) => {
  const [cookies] = useCookies(["userInfo"]);
  const [receiveProject, setReceiveProject] = useState();

  const onProjectAdd = () => {
    if (!receiveProject) {
      Modal.error({
        title: "Fail to add to project!",
        content: "A project should be selected.",
      });
      return;
    }
    addItemsToItemSet(cookies.userInfo, receiveProject, props.selectedRowKeys)
      .then(() => {
        Modal.success({
          title: "Success!",
          content: "Create project successes.",
        });
        props.onClose();
      })
      .catch((error) => {
        Modal.error({
          title: "Failed!",
          content: "Create project fails.",
        });
        props.onClose();
      });
  };

  return (
    <Modal
      title="Add to Project"
      centered
      visible={props.visible}
      onOk={onProjectAdd}
      onCancel={() => {
        props.onClose();
      }}
    >
      <ProjectListMenu
        onMenuSelect={(projectId) => {
          setReceiveProject(projectId);
        }}
      />
    </Modal>
  );
};

export default AddToProjectModal;
