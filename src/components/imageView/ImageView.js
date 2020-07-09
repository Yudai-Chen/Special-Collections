import React, { Component } from "react";
import Viewer from "react-viewer";
import { Link } from "react-router-dom";
import { Layout } from "antd";

const { Content } = Layout;
export default class ImageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      activeIndex: 0,
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ activeIndex: nextProps["active"] });
  }

  onChange = (activeImage, index) => {
    this.setState({ activeIndex: index });
  };

  render() {
    let images = this.props.imgs;

    return (
      <Layout>
        <Content>
          <div
            id={"image-view-container-" + this.props.id}
            className="image-view-container"
            style={
              this.props.viewerHeight ? { height: this.props.viewerHeight } : {}
            }
          >
            <Viewer
              zIndex={this.props.separate ? -1 : 0}
              className={"image-view-container" + this.props.id}
              visible={this.props.visible}
              noClose={true}
              container={document.getElementById(
                "image-view-container-" + this.props.id
              )}
              images={images}
              activeIndex={this.state.activeIndex}
              defaultScale={1.5}
              noNavbar={this.props.separate}
              noImgDetails={this.props.separate}
              showTotal={!this.props.separate}
              customToolbar={(toolbars) => {
                return toolbars.concat([
                  {
                    key: "detail",
                    render: (
                      <div>
                        <Link
                          to={
                            "/media/" +
                            this.props.imgs[this.state.activeIndex]["key"]
                          }
                          target="_blank"
                        >
                          L
                        </Link>
                      </div>
                    ),
                  },
                ]);
              }}
              onChange={this.onChange}
              zoomSpeed={0.1}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}
