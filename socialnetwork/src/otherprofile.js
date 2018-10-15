import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import FriendshipButton from "./friendshipbutton";

export default class OtherProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherProfile: {},
      friends: []
    };
    this.fetchData = this.fetchData.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }
  componentDidMount() {
    axios.get(`/getUser/${this.props.match.params.userId}`).then(resp => {
      if (resp.data.redirect) {
        this.props.history.push("/");
      } else {
        this.setState(resp.data);
      }
    });

    // async componentDidMount() {
    //     const resp = await axios.get(`/getUser/${this.props.match.params.userId}`)
    //     console.log('resp in OtherProfile :', resp);
    // }
  }

  componentWillReceiveProps(nextProps) {
    //compare nextProps to this.props
    if (nextProps.match.params.userId != this.props.match.params.userId) {
      this.fetchData(nextProps.match.params.userId);
    }
    // } else {
    //   console.log("same user--edit");
    //   this.props.history.push("/");
    // }
  }
  fetchData(userId) {
    axios.get(`/getUser/${userId}`).then(resp => {
      console.log("resp in fetchData", resp.data);
      this.setState(resp.data);
    });
  }
  goToProfile(id) {
    location.replace(`/user/${id}`);
  }
  render() {
    // const { bio, name, surname, url } = this.state.otherProfile;
    console.log("this.state", this.state);
    return (
      <div className="otherProfile">
        <FriendshipButton searchId={this.props.match.params.userId} />
        <div className="left">
          <h1 className="greeting">
            {this.state.otherProfile.name} {this.state.otherProfile.surname}
          </h1>
          <img src={this.state.otherProfile.url} className="bigProfilePic" />
          {this.state.otherProfile.bio ? (
            <div>
              <p className="bio">{this.state.otherProfile.bio}</p>
            </div>
          ) : (
            <p className="bio">This user has not yet left a Bio!</p>
          )}
        </div>
        <div className="otherProfileFriends">
          {this.state.friends.length ? (
            <div>
              <h2>All the Alliances:</h2>
              <div className="otherProfileFriendsWrap">
                {this.state.friends.map(friend => (
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
            </div>
          ) : (
            <h4>No Alliances</h4>
          )}
        </div>
      </div>
    );
  }
}
