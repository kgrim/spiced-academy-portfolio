import { connect } from "react-redux";
import React from "react";
import { alert } from "./actions";
import { Link } from "react-router-dom";

class Notifi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.timeOut = this.timeOut.bind(this);
  }

  timeOut() {
    setTimeout(() => {
      this.props.dispatch(alert(null));
    }, 5000);
  }

  render() {
    this.timeOut();
    console.log("STATE in notif:: ", this.props.notification);
    return (
      <div className="notification">
        <h3>
          {this.props.notification.message} {this.props.notification.senderName}{" "}
          {this.props.notification.senderSurname}.
        </h3>
        <Link to="/friends"> click here to check your Alliance status </Link>
      </div>
    );
  }
}

const getStateFromRedux = state => {
  console.log("state. notifaction:::", state);
  return {
    notification: state.notification
  };
};

export default connect(getStateFromRedux)(Notifi);
