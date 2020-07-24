import React, { useState } from "react";
import { Modal, Input } from "antd";
import { createItemSet, addItemsToItemSet } from "../utils/Utils";
import { useCookies } from "react-cookie";

// visible, selectedRowKeys, onClose
const NewProjectModal = (props) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescribe, setProjectDescribe] = useState("");
  const [cookies] = useCookies(["userInfo"]);

  const onCreateProject = () => {
    if (
      this.state.projectName === undefined ||
      this.state.projectName.length === 0
    ) {
      Modal.error({
        title: "Fail to create project!",
        content: "The project name cannot be null.",
      });
      return;
    }

    let payload = {
      "dcterms:title": [
        {
          type: "literal",
          property_id: 1,
          property_label: "Title",
          "@value": this.state.projectName,
        },
      ],
      "dcterms: description": [
        {
          type: "literal",
          property_id: 4,
          property_label: "Description",
          "@value": this.state.projectNote,
        },
      ],
    };
    createItemSet(cookies.userInfo, payload).then((response) => {
      let projectId = response.data["o:id"];
      addItemsToItemSet(cookies.userInfo, projectId, props.selectedRowKeys)
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
    });
  };

  return (
    <Modal
      title="New Project"
      centered
      visible={props.visible}
      onOk={onCreateProject}
      onCancel={() => {
        props.onClose();
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          addonBefore="Project Name"
          placeholder="Name your project here."
          value={projectName}
          onChange={({ target: { value } }) => {
            setProjectName(value);
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input
          addonBefore="Description"
          placeholder="Add your description for this project."
          value={projectDescribe}
          onChange={({ target: { value } }) => {
            setProjectDescribe(value);
          }}
        />
      </div>
    </Modal>
  );
};

export default NewProjectModal;
