import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input, Modal, Spin } from "antd";
import {
  searchResourceClasses,
  searchProperties,
  createItem,
  patchItem,
} from "../utils/Utils";
import { useCookies } from "react-cookie";
const { TextArea } = Input;

// targets
const NoteInput = (props) => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [cookies] = useCookies(["userInfo"]);
  const [noteClassId, setNoteClassId] = useState();
  const [notePropertyTerm, setNotePropertyTerm] = useState();
  const [notePropertyId, setNotePropertyId] = useState();

  useEffect(() => {
    setLoading(true);
    const params1 = {
      local_name: "Record",
    };
    const params2 = {
      local_name: "recordNote",
    };
    searchResourceClasses(cookies.userInfo.host, params1).then((response) => {
      setNoteClassId(response.data[0]["o:id"]);
    });
    searchProperties(cookies.userInfo.host, params2).then((response) => {
      setNotePropertyId(response.data[0]["o:id"]);
      setNotePropertyTerm(response.data[0]["o:term"]);
    });
  }, [cookies.userInfo]);

  useEffect(() => {
    if (
      noteClassId !== undefined &&
      notePropertyId !== undefined &&
      notePropertyTerm !== undefined
    ) {
      setLoading(false);
    }
  }, [noteClassId, notePropertyId, notePropertyTerm]);

  const onSubmit = () => {
    if (text.length === 0) {
      Modal.error({
        title: "Fail to create note!",
        content: "You did not input anything.",
      });
      return;
    }
    let refList = props.targets.map((each) => ({
      type: "resource",
      property_id: 36,
      property_label: "References",
      is_public: true,
      value_resource_id: each["o:id"],
      value_resource_name: "items",
    }));

    let payload = {
      "o:resource_class": { "o:id": noteClassId },
      "dcterms:title": [
        {
          property_id: 1,
          type: "literal",
          "@value": title,
        },
      ],
      [notePropertyTerm]: [
        {
          type: "literal",
          property_id: notePropertyId,
          property_label: "Record Note",
          "@value": text,
        },
      ],
      "dcterms:references": refList,
    };

    createItem(cookies.userInfo, payload)
      .then((response) => {
        const myInfo = {
          type: "resource",
          property_id: 35,
          property_label: "Is Referenced By",
          is_public: true,
          value_resource_id: response.data["o:id"],
          value_resource_name: "items",
        };
        props.targets.map((each) => {
          let newLinksToNotes = each["dcterms:isReferencedBy"]
            ? [...each["dcterms:isReferencedBy"]]
            : [];
          newLinksToNotes.push(myInfo);
          each["dcterms:isReferencedBy"] = newLinksToNotes;

          patchItem(cookies.userInfo, each["o:id"], each).catch((error) => {
            Modal.error({
              title: "Fail to update item!",
              content:
                "Fails to update the dcterms:isReferencedBy field of item " +
                each["o:id"],
            });
          });
          return each;
        });
      })
      .then(() => {
        Modal.success({
          title: "Success!",
          content: "Add note successes.",
        });
      })
      .catch((error) => {
        Modal.error({
          title: "Fail to create note!",
          content: "Please check your key pair and network connection.",
        });
      });
  };

  return loading ? (
    <Spin />
  ) : (
    <Row gutter={[16, 24]} justify="end">
      <Col span={24}>
        <h2>Note:</h2>
        <Input
          addonBefore="Title"
          placeholder="Input the title of the note"
          value={title}
          onChange={({ target: { value } }) => {
            setTitle(value);
          }}
        />
        <TextArea
          value={text}
          onChange={({ target: { value } }) => {
            setText(value);
          }}
          autoSize={{ minRows: 25, maxRows: 25 }}
        />
      </Col>
      <Col span={6}>
        <Button type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default NoteInput;
