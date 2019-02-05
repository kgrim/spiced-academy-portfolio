import * as io from "socket.io-client";
import {
  receiveOnlineUsers,
  updateOnlineUsers,
  userLeft,
  chatMessage,
  chatMessages,
  alert
} from "./actions";
let socket;

export function getSocket(store) {
  if (!socket) {
    socket = io.connect();

    socket.on("onlineUsers", data => {
      store.dispatch(receiveOnlineUsers(data));
    });

    socket.on("userJoined", data => {
      store.dispatch(updateOnlineUsers(data));
    });

    socket.on("userLeft", id => {
      store.dispatch(userLeft(id));
    });

    socket.on("chatMessages", messages => {
      store.dispatch(chatMessages(messages));
    });

    socket.on("chatMessage", message => {
      store.dispatch(chatMessage(message));
    });

    socket.on("alert", notification => {
      console.log("inside sockets, alert ::", notification);
      store.dispatch(alert(notification));
    });

  }
  return socket;
}

///////////////////////////////////////
