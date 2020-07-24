import React, { Component } from "react";
import { Button, Space, Input, Tabs, Row, Col, Divider } from "antd";
import SearchForm from "../components/ItemSearchForm";
import axios from "axios";
import { PlaceHolder } from "../utils/Utils";

const { TabPane } = Tabs;

export default class SearchPage extends Component {
  state = {
    loading: false,
    transcriptKeyword: "",
  };

  formRef = React.createRef();

  searchTranscript = () => {
    let transcriptItems = [];
    let params = {
      fulltext_search: "",
      ["property[0][joiner]"]: "and",
      ["property[0][property]"]: 83,
      ["property[0][type]"]: "in",
      ["property[0][text]"]: this.state.transcriptKeyword,
      sort_by: "o:item"["o:id"],
    };
    axios
      .get(HOST_ADDRESS + "/api/media?per_page=1000", {
        params: params,
      })
      .then(
        (response) => {
          let results = [];
          let lastId = -1;
          this.setState({ loadingResults: true });
          response.data.map((record) => {
            if (record["o:item"]["o:id"] == lastId) {
              results[results.length - 1].media.push({
                mediaId: record["o:id"],
                mediaTitle: record["o:title"],
                thumbnail: record["o:thumbnail_urls"]["square"],
                transcript: record["bibo:transcriptOf"]
                  ? record["bibo:transcriptOf"][0]["@value"].substring(0, 50)
                  : "",
              });
            } else {
              transcriptItems.push(record["o:item"]["o:id"]);
              results.push({
                key: record["o:item"]["o:id"],
                itemId: record["o:item"]["o:id"],
                title: "Unknown",
                created: "Unknown",
                preview: PlaceHolder,
                media: [
                  {
                    mediaId: record["o:id"],
                    mediaTitle: record["o:title"],
                    thumbnail: record["o:thumbnail_urls"]["square"],
                    transcript: record["bibo:transcriptOf"]
                      ? record["bibo:transcriptOf"][0]["@value"].substring(
                          0,
                          50
                        )
                      : "",
                  },
                ],
              });
              lastId = record["o:item"]["o:id"];
            }
          });
          return results;
        },
        () => {
          console.log("error");
        }
      )
      .then((results) => {
        this.setState({ results, transcriptItems }, () => {
          this.setState({
            loadingResults: false,
            transcriptSearch: true,
          });
        });
      });
  };

  render() {
    return (
      <Row gutter={16}>
        <Col span={6}>
          <div>
            <Divider>Item Search</Divider>
            <SearchForm />
            <Divider>Transcript Search</Divider>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                addonBefore="Keyword"
                placeholder="Search for media whose transcript contains ..."
                value={this.state.transcriptKeyword}
                onChange={({ target: { value } }) => {
                  this.setState({ transcriptKeyword: value });
                }}
              ></Input>
              <Button type="primary" onClick={this.searchTranscript}>
                Search for transcript
              </Button>
            </Space>
          </div>
        </Col>
        <Col span={18}></Col>
      </Row>
    );
  }
}
