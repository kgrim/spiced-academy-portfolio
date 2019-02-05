import { connect } from "react-redux";
import React from "react";
import { getRecentChatMsgs, addMsg } from "./actions";
import { getSocket } from "./socket";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.saveChatMsg = this.saveChatMsg.bind(this);
  }

  componentDidUpdate() {
    if (!this.element) {
      return;
    } else {
      this.element.scrollTop =
        this.element.scrollHeight - this.element.clientHeight;
    }
  }

  saveChatMsg(e) {
    if (e.which === 13) {
      getSocket().emit("chat", e.target.value);
      e.target.value = "";
    }
  }

  render() {
    if (!this.props.messages) {
      return "chat goes here";
    }

    return (
      <div className="chat" ref={element => (this.element = element)}>
        {this.props.messages.map(message => (
          <div key={message.chatid}>
            <p>
              {message.name} {message.surname}
            </p>
            <p>Created at {message.created_at} </p>
            <h3 className="message">{message.message}</h3>
          </div>
        ))}
        <textarea className="chatTxtArea" onKeyDown={this.saveChatMsg} />
      </div>
    );
  }
}

const getStateFromRedux = state => {
  console.log("state.recentMessages:", state.recentMessages);
  return {
    messages: state.recentMessages
  };
};
export default connect(getStateFromRedux)(Chat);

//////////////////////////////////////////////////////////
