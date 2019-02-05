import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";
import Logo from "./logo.js";
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this[e.target.name] = e.target.value;
  }

  submit() {
    axios
      .post("/register", {
        name: this.name,
        surname: this.surname,
        pass: this.pass,
        email: this.email
      })
      .then(({ data }) => {
        if (data.success) {
          location.replace("/");
        } else {
          this.setState({
            error: true
          });
        }
      });
  }
  render() {
    return (
      <div className="register">
        <h3>Register here: </h3>
        {this.state.error && <div className="error">YOU MESSED UP</div>}
        <input name="name" placeholder="name" onChange={this.handleChange} />
        <input
          name="surname"
          placeholder="known as"
          onChange={this.handleChange}
        />
        <input
          name="pass"
          placeholder="password"
          type="password"
          onChange={this.handleChange}
        />
        <input name="email" placeholder="email" onChange={this.handleChange} />
        <button onClick={this.submit}>Welcome </button>
        <Link to="/login" className="link">
          Are you already part of the crew, click here to Log-in....
        </Link>
      </div>
    );
  }
}
