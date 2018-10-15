import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Logo from "./logo.js";
import Uploader from "./uploader";
import Profilepic from "./profilepic";
import Profile from "./profile";
import Friends from "./friends";
import OtherProfile from "./otherprofile";
import currOnlineUsers from "./currentonlineusers";
import { Link } from "react-router-dom";
import Notifi from "./notification";
import { getSocket } from "./socket";
import { connect } from "react-redux";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateUrl = this.updateUrl.bind(this);
    this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
    this.makeUploaderInvisible = this.makeUploaderInvisible.bind(this);
    this.toggleBio = this.toggleBio.bind(this);
    this.setBio = this.setBio.bind(this);
    // this.notification = this.notification.bind(this);
  }
  componentDidMount() {
    axios.get("/user").then(({ data }) => {
      console.log("app data :: ", data);
      this.setState(data);

      // axios.get("/user").then(resp => {
      //   console.log("resp ", resp);
      //   const { id, name, surname, bio, url } = resp.data;
      //   this.setState({ id, name, surname, bio, url: url });
      // });
    });
  }
  makeUploaderVisible() {
    this.setState({ uploaderVisible: true });
  }
  makeUploaderInvisible() {
    this.setState({ uploaderVisible: false });
  }
  updateUrl(url) {
    this.setState({
      url: url,
      uploaderVisible: false
    });
  }
  toggleBio() {
    this.setState({
      showBio: !this.state.showBio
    });
  }
  setBio(e) {
    if (e.which === 13) {
      axios
        .post("/userBio/" + e.target.value)
        .then(({ data }) => {
          this.setState({
            bio: data.bio,
            showBio: false
          });
        })
        .catch(e => console.log("Error in setBio :", e));
    }
  }
  notification() {} // dispatch the notifaction ( hide notif action that will flip the value string to faulsy val)

  render() {
    console.log("this.props.notification", this.props.notification);
    if (!this.state.id) {
      return <img src="./loading.gif" />;
    }
    const { name, surname, url, bio, showBio } = this.state;
    return (
      <BrowserRouter>
        <div className="rain">
          {this.props.notification && <Notifi />}
          <div className="container">
            <nav>
              <Logo />
              <div className="otherLinks">
                <Link to="/onlinefriends" id="onlineAlliances">
                  OnlineAlliances
                </Link>
                <br />
                <Link to="/friends" id="alliances">
                  Alliances
                </Link>
                <br />
                <Link to="/" id="profile">
                  Profile
                </Link>
                <br />
                <a href="/logout" id="logout">
                  Logout
                </a>
              </div>
              <Profilepic
                url={url}
                name={name}
                surname={surname}
                makeUploaderVisible={this.makeUploaderVisible}
              />
            </nav>
            {this.state.uploaderVisible && (
              <Uploader
                updateUrl={this.updateUrl}
                closeUploader={this.makeUploaderInvisible}
              />
            )}

            <div className="mainProfile">
              <Route
                exact
                path="/"
                render={() => (
                  <Profile
                    url={url}
                    name={name}
                    surname={surname}
                    makeUploaderVisible={this.makeUploaderVisible}
                    bio={bio}
                    toggleBio={this.toggleBio}
                    setBio={this.setBio}
                    showBio={showBio}
                  />
                )}
              />
              <Route exact path="/user/:userId" component={OtherProfile} />
              <Route exact path="/friends" component={Friends} />
              <Route exact path="/onlinefriends" component={currOnlineUsers} />
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const getStateFromRedux = state => {
  return {
    notification: state.notification
  };
};
export default connect(getStateFromRedux)(App);
