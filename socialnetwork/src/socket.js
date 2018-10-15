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
      // console.log("data inside onlineUsers:: ", data);
      store.dispatch(receiveOnlineUsers(data));
    });

    socket.on("userJoined", data => {
      // console.log("data inside userJoined:: ", data);
      store.dispatch(updateOnlineUsers(data));
    });

    socket.on("userLeft", id => {
      // console.log("data inside userLeft:: ", data);
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

    // socket.on("noAlert", notification => {
    //   store.dispatch(alert(notification));
    // });
  }
  return socket;
}

///////////////////////////////////////
