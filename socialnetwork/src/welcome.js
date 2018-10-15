import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import Register from "./register.js";
import Login from "./login.js";
import Logo from "./logo.js";

export default function Welcome() {
  return (
    <div className="rain">
      <div className="container">
        <h1 className="logoFrenemy bigLogo">fr_enemy_ </h1>
        <h1 className="welcomeIntro">
          This is the perfect platform for you, as a Villain to connect with
          other masterminds.
        </h1>

        <HashRouter>
          <div>
            <Route exact path="/" component={Register} />
            <Route path="/login" component={Login} />
          </div>
        </HashRouter>
      </div>
    </div>
  );
}
