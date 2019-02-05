export default function reducer(state = {}, action) {
  if (action.type == "RECEIVE_FRIENDS_WANNABES") {
    state = Object.assign({}, state, {
      friends: action.friends
    });
  }
  if (action.type == "ACCEPT_FRIEND_REQUEST") {
    state = {
      ...state,
      friends: state.friends.map(friend => {
        if (friend.id == action.id) {
          return { ...friend, status: 2 };
        } else {
          return friend;
        }
      })
    };
  }
  if (action.type == "UNFRIEND") {
    state = {
      ...state,
      friends: state.friends.filter(friend => friend.id != action.id)
    };
  }
  if (action.type == "ONLINE_FRIENDS") {
    state = {
      ...state,
      onlineFriends: action.data
    };
  }
  if (action.type == "UPDATE_ONLINE_FRIENDS") {
    state = {
      ...state,
      onlineFriends: [action.data, ...state.onlineFriends]
    };
  }
  if (action.type == "USER_LEFT") {
    state = {
      ...state,
      onlineFriends: state.onlineFriends.filter(user => user.id != action.id)
    };
  }
  if (action.type == "CHAT_MESSAGES") {
    state = {
      ...state,
      recentMessages: action.recentMessages
    };
  }

  if (action.type == "CHAT_MESSAGE") {
    state = {
      ...state,
      recentMessages: [...state.recentMessages, action.latestMessage]
    };
  }

  if (action.type == "NOTIFICATION") {
    state = {
      ...state,
      notification: action.notification
    };
  }

  return state;
}
