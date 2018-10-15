import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this[e.target.name] = e.target.value;
    // console.log(this[e.target.name]);
  }

  submit() {
    axios
      .post("/login", {
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
      <div className="login">
        <h3>Log-in here: </h3>
        {this.state.error && <div className="error">YOU MESSED UP</div>}
        <input
          name="pass"
          type="password"
          placeholder="password"
          onChange={this.handleChange}
        />
        <input name="email" placeholder="email" onChange={this.handleChange} />
        <button onClick={this.submit}>submit </button>
        <Link to="/" className="link">
          Click here to Register...
        </Link>
      </div>
    );
  }
}
