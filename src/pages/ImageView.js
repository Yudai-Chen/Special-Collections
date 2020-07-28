import React, { useState, useEffect } from "react";
import Viewer from "react-viewer";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { PATH_PREFIX } from "../utils/Utils";

const { Content } = Layout;

// dataSource, loading
const ImageView = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  useEffect(() => {
    setImages(
      props.dataSource.map((each) => ({
        key: each["o:id"],
        src: each["o:original_url"],
        alt: each["o:title"],
      }))
    );
  }, [props.dataSource]);

  return (
    <Layout>
      <Content>
        <div
          id={"image-view-container-" + 1}
          className="image-view-container"
          //   style={
          //     this.props.viewerHeight ? { height: this.props.viewerHeight } : {}
          //   }
        >
          <Viewer
            zIndex={0}
            className={"image-view-container" + 1}
            visible={true}
            noClose={true}
            container={document.getElementById("image-view-container-" + 1)}
            images={images}
            activeIndex={activeIndex}
            defaultScale={1.5}
            // noNavbar={this.props.separate}
            noImgDetails={true}
            attribute={false}
            // showTotal={!this.props.separate}
            customToolbar={(toolbars) => {
              return toolbars.concat([
                {
                  key: "detail",
                  render: (
                    <div>
                      <Link
                        to={
                          PATH_PREFIX +
                          "/media/" +
                          props.dataSource[activeIndex]["o:id"]
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
            onChange={(activeImage, index) => {
              setActiveIndex(index);
            }}
            zoomSpeed={0.1}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default ImageView;
