import React, { useState, useEffect } from "react";
import Viewer from "react-viewer";
import { Link } from "react-router-dom";
import { ExpandOutlined } from "@ant-design/icons";
import { PATH_PREFIX, PlaceHolder } from "../utils/Utils";

// dataSource, containerId
const ImageView = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [inline, setInline] = useState(true);
  useEffect(() => {
    setImages(
      props.dataSource.map((each) => ({
        key: each["o:id"],
        src: each["o:original_url"],
        alt: each["o:title"],
        downloadUrl: each["o:original_url"],
      }))
    );
  }, [props.dataSource]);

  return (
    <div>
      <Viewer
        zIndex={0}
        visible={true}
        noClose={inline}
        container={
          inline
            ? document.getElementById(
                "image-view-container-" + props.containerId
              )
            : null
        }
        downloadable={true}
        downloadInNewWindow={true}
        images={images}
        activeIndex={activeIndex}
        defaultScale={1.5}
        defaultImg={<img src={PlaceHolder} alt="PlaceHolder" />}
        noImgDetails={true}
        attribute={false}
        onClose={() => {
          setInline(true);
        }}
        customToolbar={(toolbars) => {
          return toolbars.concat([
            {
              key: "expand",
              render: <ExpandOutlined />,
              onClick: () => setInline(false),
            },
            {
              key: "detail",
              render: (
                <div>
                  <Link
                    to={
                      PATH_PREFIX +
                      "/media/" +
                      JSON.stringify([props.dataSource[activeIndex]["o:id"]])
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
  );
};

export default ImageView;
