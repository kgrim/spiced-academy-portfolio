import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Profle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(props) {
    const {
      setBio,
      toggleBio,
      showBio,
      bio,
      name,
      surname,
      url,
      makeUploaderVisible
    } = this.props;
    return (
      <div className="profile">
        <h1 className="greeting">
          Greetings Villain: {name} {surname}..
        </h1>
        <img
          src={url}
          className="bigProfilePic"
          onClick={makeUploaderVisible}
        />
        {bio ? (
          <div>
            <p className="bio">{bio}</p>
            <button onClick={toggleBio} className="bioButton">
              Edit
            </button>
          </div>
        ) : (
          <p onClick={toggleBio} className="bio">
            Tell us more about yourself, add a Bio
          </p>
        )}
        {showBio && <textarea onKeyDown={setBio} defaultValue={bio} />}
      </div>
    );
  }
}
