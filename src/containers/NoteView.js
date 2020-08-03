import React, { useState, useEffect } from "react";
import NoteInput from "../components/NoteInput";
import { useParams } from "react-router-dom";
import { getItems, PATH_PREFIX } from "../utils/Utils";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Spin, Row, Col, Menu } from "antd";

// In this component, I've hardcoded the property ID of "dcterms:references" as 36, "dcterms:isReferencedBy" as 35. I think it is a default configuration of Omeka S
const NoteView = () => {
  const [cookies] = useCookies(["userInfo"]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { targetList } = useParams();

  useEffect(() => {
    let targets = JSON.parse(targetList);
    setLoading(true);
    getItems(cookies.userInfo.host, targets).then(
      axios.spread((...responses) => {
        let data = responses.map((each) => each.data);
        setData(data);
      })
    );
  }, [cookies.userInfo, targetList]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return loading ? (
    <Spin />
  ) : (
    <Row gutter={16}>
      <Col span={8}>
        <h2>Targets:</h2>
        <Menu
          onClick={({ item, key }) => {
            let win = window.open(PATH_PREFIX + "/items/" + key, "_blank");
            win.focus();
            return;
          }}
          selectable={false}
          mode="vertical"
        >
          {data.map((item) => (
            <Menu.Item key={item["o:id"]}>{item["o:title"]}</Menu.Item>
          ))}
        </Menu>
      </Col>
      <Col span={16}>
        <NoteInput targets={data} />
      </Col>
    </Row>
  );
};

//   state = {
//     input: "",
//     targets: [],
//     loading: false,
//     checkedFiles: [],
//     displaying: undefined,
//     data: [],
//     media: undefined,
//   };

//   constructor(props) {
//     super(props);
//     let targets = props.match.params.targetList;
//     console.log(JSON.parse(targets));
//     this.state.targets = JSON.parse(targets);
//     // if (this.props.location.state !== undefined) {
//     //   const { targets } = this.props.location.state;
//     //   this.state.targets = targets;
//     // }
//   }

//   getData = () => {
//     let data = [];
//     let requests = this.state.targets.map((each) => {
//       return axios.get(HOST_ADDRESS + "/api/items/" + each["key"]);
//     });
//     axios.all(requests).then(
//       axios.spread((...responses) => {
//         responses.map((each) => {
//           data.push(each.data);
//         });
//         this.setState({ data: data }, () => {
//           this.setState({ loadingData: false });
//         });
//       })
//     );
//   };

//   componentWillReceiveProps(nextProps) {
//     // if (nextProps.location.state !== undefined) {
//     //   this.setState({ loading: true });
//     //   const { targets } = nextProps.location.state;
//     //   this.setState({ targets }, () => {
//     //     this.setState({ loading: false });
//     //   });
//     // }
//   }

//   onTextChange = ({ target: { value } }) => {
//     this.setState({ input: value });
//   };

//   onCheck = (checkedKeys) => {
//     const files = [];
//     checkedKeys.map((each) => {
//       files.push(each);
//     });
//     this.setState({ checkedFiles: files });
//   };

//   onRemove = () => {
//     let data = this.state.targets;
//     this.setState({ loading: true });
//     this.state.checkedFiles.map((eachKey) => {
//       let index;
//       data.forEach((each, i) => {
//         if (each["key"] == eachKey) {
//           index = i;
//         }
//       });
//       data.splice(index, 1);
//       //   data.remove();
//     });
//     this.setState({ targets: data }, () => {
//       this.setState({ loading: false });
//     });
//   };

//   onSelect = (itemKey) => {
//     console.log(itemKey[0]);
//     this.setState({ displaying: itemKey[0] });
//     if (this.state.displaying) {
//       axios
//         .get(HOST_ADDRESS + "/iiif/" + this.state.displaying + "/manifest")
//         .then((response) => {
//           try {
//             let media = response.data["sequences"][0].canvases.map(
//               (canvas, index) => ({
//                 key: canvas["images"][0]["resource"]["service"][
//                   "@id"
//                 ].substring(
//                   canvas["images"][0]["resource"]["service"]["@id"].lastIndexOf(
//                     "/"
//                   ) + 1
//                 ),
//                 src: canvas["images"][0]["resource"]["@id"],
//                 alt: canvas["label"],
//               })
//             );
//             this.setState({ media, loading: false });
//           } catch (error) {
//             this.setState({ media: [], loading: false });
//           }
//         });
//     }
//   };

//   onSubmit = () => {
//     let payload = {
//       "dcterms:title": [
//         {
//           type: "literal",
//           property_id: 1,
//           property_label: "Title",
//           "@value": this.state.projectName,
//         },
//       ],
//       "dcterms: description": [
//         {
//           type: "literal",
//           property_id: 4,
//           property_label: "Description",
//           "@value": this.state.projectNote,
//         },
//       ],
//     };
//     // axios
//     //   .post(HOST_ADDRESS + "/api/items", payload, {
//     //     params: {
//     //       key_identity,
//     //       key_credential,
//     //     },
//     //     headers: headers,
//     //   })
//     //   .then((response) => {
//     //     let projectId = response.data["o:id"];
//     //     return this.state.selectedRowKeys.map((each) => {
//     //       return axios.get(HOST_ADDRESS + "/api/items/" + each).then((response) => {
//     //         let originItemSets = response.data["o:item_set"] ? response.data["o:item_set"] : [];
//     //         originItemSets.push({ "o:id": projectId });
//     //         return axios.patch(HOST_ADDRESS + "/api/items/" + each, { "o:item_set": originItemSets }, {
//     //           params: {
//     //             key_identity,
//     //             key_credential,
//     //           },
//     //           headers: headers,
//     //         });
//     //       })

//     //     })
//     //   })
//     //   .then((requests) => {
//     //     axios.all(requests).then(() => {
//     //       Modal.success({
//     //         title: "Success!",
//     //         content: "Create project success.",
//     //       });
//     //       this.setState({ projectLoading: true });
//     //       this.loadProjectList();
//     //     });
//     //   })
//     // this.state.targets.map();
//   };

//   render() {
//     return this.state.loading ? (
//       <Spin></Spin>
//     ) : (
//         <div>
//           <Row gutter={[16, 24]} justify="end">
//             <Col span={6}>
//               <Col span={24}>
//                 <h2>Attach to:</h2>
//                 <DirectoryTree
//                   treeData={this.state.targets}
//                   blockNode={true}
//                   checkable
//                   onCheck={this.onCheck}
//                   onSelect={this.onSelect}
//                 />
//               </Col>
//               <Col span={6}>
//                 <Button onClick={this.onRemove}>Remove</Button>
//               </Col>
//             </Col>
//             <Col span={6}>
//               <ImageView
//                 id={this.state.displaying}
//                 visible={true}
//                 imgs={this.state.media}
//               />
//             </Col>
//             <Col span={12}>
//               <Row gutter={[16, 24]} justify="end">
//                 <Col span={24}>
//                   <h2>Note:</h2>
//                   <TextArea
//                     value={this.state.input}
//                     onChange={this.onTextChange}
//                     autoSize={{ minRows: 25, maxRows: 25 }}
//                   />
//                 </Col>
//                 <Col span={6}>
//                   <Button type="primary" onClick={this.onSubmit}>
//                     Submit Change
//                 </Button>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </div>
//       );
//   }
// }

export default NoteView;
