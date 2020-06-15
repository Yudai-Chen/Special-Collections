import React, { Component } from "react";
import Viewer from "react-viewer";

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

  render() {
    let images = this.props.imgs;

    return (
      <div>
        <div
          id={"image-view-container" + this.props.id}
          className="image-view-container"
        />
        <Viewer
          className={"image-view-container" + this.props.id}
          visible={this.props.visible}
          noClose={true}
          container={document.getElementById(
            "image-view-container" + this.props.id
          )}
          images={images}
          activeIndex={this.state.activeIndex}
          customToolbar={(toolbars) => {
            return toolbars.concat([
              {
                key: "test",
                render: <div>C</div>,
                onClick: (activeImage) => {
                  console.log(activeImage);
                },
              },
            ]);
          }}
        />
      </div>
    );
  }
}
