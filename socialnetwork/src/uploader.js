import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateImage = this.updateImage.bind(this);
    this.closeUploader = this.closeUploader.bind(this);
  }
  updateImage(e) {
    this.file = e.target.files[0];
    let file = this.file;
    const fd = new FormData();
    fd.append("file", file);

    axios.post("/upload", fd).then(({ data }) => {
      this.props.updateUrl(data.url);
    });
  }
  closeUploader(e) {
    e.preventDefault();
    this.props.closeUploader();
  }
  render(props) {
    return (
      <div className="popup">
        <div className="module">
          <p onClick={this.closeUploader} className="close">
            CLOSE
          </p>
          <br />
          Show us your evil side.. & give us a evil smile! Showing your happy
          self results in having no Alliance.
          <br />
          <input type="file" id="ch" onChange={this.updateImage} />
          <label htmlFor="ch" />
        </div>
      </div>
    );
  }
}
