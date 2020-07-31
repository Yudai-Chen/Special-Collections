import React, { Component } from "react";
// import ImageView from "./ImageView";
// import axios from "axios";
// import { Button, Layout, Row, Col, Spin, Input } from "antd";
// import { HOST_ADDRESS } from "./Mainpage";

// const { TextArea } = Input;
// const { Header, Content } = Layout;

// TODO
const TranscriptView = () => {
  return <h1>Transcript View</h1>;
};
export default TranscriptView;
// export default class ImageDetails extends Component {
//   state = {
//     data: [],
//     mediaId: undefined,
//     loading: false,
//   };

//   constructor(props) {
//     super(props);
//     this.state.loading = true;
//     let id = parseInt(props.match.params.mediaId, 10);
//     this.state.mediaId = id;
//     try {
//       axios
//         .get(HOST_ADDRESS + "/api/media/" + id)
//         .then((response) => {
//           this.state.data = response.data;
//         })
//         .then(() => {
//           this.setState({ loading: false });
//         });
//     } catch (error) {}
//   }

//   onTextChange = ({ target: { value } }) => {
//     let data = this.state.data;
//     data["bibo:transcriptOf"][0]["@value"] = value;
//     this.setState({ data });
//   };

//   render() {
//     return this.state.loading ? (
//       <Spin tip="loading..."></Spin>
//     ) : (
//       <Layout>
//         <Content>
//           <Row gutter={[16, 24]} justify="end">
//             <Col span={12}>
//               <ImageView
//                 id={this.state.mediaId}
//                 visible={true}
//                 imgs={[
//                   {
//                     key: this.state.data["o:id"],
//                     src: this.state.data["o:original_url"],
//                     alt: this.state.data["o:source"],
//                   },
//                 ]}
//                 active={0}
//                 separate={true}
//                 viewerHeight={600}
//               />
//             </Col>
//             <Col span={12}>
//               <TextArea
//                 value={
//                   this.state.data["bibo:transcriptOf"]
//                     ? this.state.data["bibo:transcriptOf"][0]["@value"]
//                     : ""
//                 }
//                 onChange={this.onTextChange}
//                 autoSize={{ minRows: 25, maxRows: 25 }}
//               />
//             </Col>
//             <Col span={6}>
//               <Button type="primary" onClick={this.onSubmitTrans}>
//                 Submit Change
//               </Button>
//             </Col>
//           </Row>
//         </Content>
//       </Layout>
//     );
//   }
// }
