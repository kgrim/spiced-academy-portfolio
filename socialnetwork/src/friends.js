import { connect } from "react-redux";
import React from "react";
import {
  receiveFriendsWannabes,
  acceptFriendRequest,
  unfriend
} from "./actions";

class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.goToProfile = this.goToProfile.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(receiveFriendsWannabes());
  }
  goToProfile(id) {
    location.replace(`/user/${id}`);
  }

  render() {
    if (!this.props.friends) {
      return <h3> No Alliances </h3>;
    }

    return (
      <div className="friendsRoute">
        <div>
          {this.props.wannabes.length ? (
            <div>
              <h3>Your Possible Alliances:</h3>
              {this.props.wannabes.map(wannabe => (
                <div key={wannabe.id} className="wannabeDiv">
                  <div className="textButtonWannabes">
                    <h4>
                      {wannabe.name}
                      {wannabe.surname}
                    </h4>
                    <button
                      className="friendsButton"
                      onClick={e => {
                        this.props.dispatch(acceptFriendRequest(wannabe.id));
                      }}
                    >
                      Aceept Alliance
                    </button>
                  </div>
                  <img
                    onClick={e => {
                      this.goToProfile(wannabe.id);
                    }}
                    className="wannabeImg"
                    src={wannabe.url}
                  />
                </div>
              ))}
            </div>
          ) : (
            <h4 />
          )}
        </div>

        <div>
          {this.props.friends.length ? (
            <div>
              <h3>Your Alliances: </h3>
              {this.props.friends.map(friend => (
                <div key={friend.id} className="friendsDiv">
                  <div className="textButtonFriends">
                    <h4>
                      {friend.name}
                      {friend.surname}
                    </h4>
                    <button
                      className="friendsButton"
                      onClick={e => {
                        this.props.dispatch(unfriend(friend.id));
                      }}
                    >
                      Create Enemy
                    </button>
                  </div>
                  <img
                    onClick={e => {
                      this.goToProfile(friend.id);
                    }}
                    className="friendsImg"
                    src={friend.url}
                  />
                </div>
              ))}
            </div>
          ) : (
            <h4 />
          )}
        </div>
      </div>
    );
  }
}

const getStateFromRedux = state => {
  return {
    friends: state.friends && state.friends.filter(user => user.status == 2),
    wannabes: state.friends && state.friends.filter(user => user.status == 1)
  };
};
export default connect(getStateFromRedux)(Friends);
