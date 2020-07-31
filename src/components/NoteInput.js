import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input, Modal, Spin } from "antd";
import {
  searchResourceClasses,
  searchProperties,
  createItem,
} from "../utils/Utils";
import { useCookies } from "react-cookie";
const { TextArea } = Input;

// TODO: submit
// targets
const NoteInput = (props) => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
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
    let payload = {
      "o:resource_class[o:id]": noteClassId,
      [notePropertyTerm]: [
        {
          type: "literal",
          property_id: notePropertyId,
          property_label: "Record Note",
          "@value": text,
        },
      ],
    };
    console.log(payload);
    console.log(text);
    console.log(props.targets);
  };

  return loading ? (
    <Spin />
  ) : (
    <Row gutter={[16, 24]} justify="end">
      <Col span={24}>
        <h2>Note:</h2>
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
