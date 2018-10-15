import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import Uploader from "./uploader";

export default function Profilepic(props) {
  return (
    <div>
      <img
        className="profilepic"
        src={props.url}
        onClick={props.makeUploaderVisible}
      />
    </div>
  );
}
