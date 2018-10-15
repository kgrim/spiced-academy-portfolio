import { connect } from "react-redux";
import React from "react";
import { receiveOnlineUsers, updateOnlineUsers, userLeft } from "./actions";
import Chat from "./chat";

class currOnlineUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.goToProfile = this.goToProfile.bind(this);
  }
  goToProfile(id) {
    location.replace(`/user/${id}`);
  }
  render() {
    if (!this.props.onlineFriends) {
      return null;
    }
    // console.log(
    //   "render props in currOnlineUsers/currentonlinefriends.js: ",
    //   this.props
    // );
    return (
      <div className="onlineChatContainer">
        <div className="onlineContainer">
          <h2>Online Alliances</h2>
          {this.props.onlineFriends.map(friend => (
            <div key={friend.id}>
              <img
                onClick={e => {
                  this.goToProfile(friend.id);
                }}
                className="friendsImg onlineImg"
                src={friend.url}
              />
              {friend.name}
              {friend.surname}
            </div>
          ))}
        </div>
        <Chat />
      </div>
    );
  }
}

const getStateFromRedux = state => {
  // console.log("STATE::::", state.onlineFriends);
  return {
    onlineFriends: state.onlineFriends
  };
};
export default connect(getStateFromRedux)(currOnlineUsers);
