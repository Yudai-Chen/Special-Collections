import React, { useState, useEffect } from "react";
import { Button, Space, Input, Spin } from "antd";
import { useCookies } from "react-cookie";
import { searchMedia, getItems, searchProperties } from "../utils/Utils";

// TODO
const MediumSearchForm = () => {
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [transcriptPropertyId, setTranscriptPropertyId] = useState();
  const [processingResult, setProcessingResult] = useState(false);
  const [cookies] = useCookies(["userInfo"]);

  useEffect(() => {
    setLoading(true);
    const params = {
      term: "bibo:transcriptOf",
    };
    searchProperties(cookies.userInfo.host, params).then((response) => {
      setTranscriptPropertyId(response.data[0]["o:id"]);
    });
  }, [cookies.userInfo]);

  useEffect(() => {
    setLoading(false);
  }, [transcriptPropertyId]);

  const onFinish = () => {
    setProcessingResult(true);
    let params = {
      fulltext_search: "",
      "property[0][joiner]": "and",
      "property[0][property]": transcriptPropertyId,
      "property[0][type]": "in",
      "property[0][text]": keyword,
      sort_by: "o:item"["o:id"],
    };
    searchMedia(cookies.userInfo.host, params).then((response) => {
      let containerItems = new Set(
        response.data.map((record) => record["o:item"]["o:id"])
      );
      getItems(cookies.userInfo.host, [...containerItems]);
    });
  };

  return loading ? (
    <Spin />
  ) : (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        addonBefore="Keyword"
        placeholder="Search for media whose transcript contains ..."
        value={keyword}
        onChange={({ target: { value } }) => {
          setKeyword(value);
        }}
      ></Input>
      <Button type="primary" onClick={onFinish}>
        Transcript Search
      </Button>
    </Space>
  );
};

export default MediumSearchForm;
