import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class FriendshipButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: "",
      status: null,
      sender_id: "",
      receiver_id: ""
    };
    this.buttonTextReq = this.buttonTextReq.bind(this);
  }
  componentDidMount() {
    axios.get(`/getFriendshipStatus/${this.props.searchId}`).then(resp => {
      this.setState(resp.data.getFriendshipStatus);
      if (!resp.data.getFriendshipStatus.status) {
        this.setState({ buttonText: "Send Alliance Request" });
      }
      if (resp.data.getFriendshipStatus.status) {
        this.setState(resp.data.getFriendshipStatus);

        if (this.state.status === 1) {
          if (this.props.searchId == this.state.receiver_id) {
            this.setState({ buttonText: "Cancel Potential Alliance" });
          } else {
            this.setState({ buttonText: "Accept Alliance" });
          }
        }
        if (this.state.status === 2) {
          this.setState({ buttonText: "Create Enemy" });
        } else {
          console.log("404 not found");
        }
      }
    });
  }

  buttonTextReq() {
    if (this.state.status == null) {
      axios.post(`/friendshipButton/${this.props.searchId}`).then(resp => {
        this.setState(resp.data.frienshipStatusUpdate);
        if (this.state.sender_id != this.props.searchId) {
          this.setState({ buttonText: "Cancel Potential Alliance" });
        } else {
          this.setState({ buttonText: "Accept Alliance" });
        }
      });
    }
    if (this.state.status === 1) {
      if (this.state.sender_id != this.props.searchId) {
        axios.post(`/deleteFriend/${this.props.searchId}`).then(resp => {
          this.setState({ buttonText: "Send Alliance Request", status: null });
        });
      } else {
        axios.post(`/updateFriendship/${this.props.searchId}`).then(resp => {
          this.setState({ resp });
          this.setState({ buttonText: "Create Enemy" });
        });
      }
    }
    if (this.state.status === 2) {
      axios.post(`/deleteFriend/${this.props.searchId}`).then(resp => {
        this.setState({ buttonText: "Send Alliance Request", status: null });
      });
    }
  }
  render() {
    return (
      <div>
        <button onClick={this.buttonTextReq} className="friendshipButton">
          {this.state.buttonText}
        </button>
      </div>
    );
  }
}
