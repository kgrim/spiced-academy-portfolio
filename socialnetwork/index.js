const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const secrets = require("./secrets.json");
const csurf = require("csurf");
const { upload } = require("./s3.js");
const cookieSession = require("cookie-session");
const {
  register,
  logIn,
  hashPass,
  checkPass,
  changeUrl,
  changeBio,
  getOtherProfile,
  sendFriendRequest,
  checkForFriendStatus,
  changeFriendStatus,
  deleteFriend,
  getWannabeFriends,
  getUsersByIds,
  getRecentChatMsgs,
  addMsg,
  getFriendsOnProfile
} = require("./dbreq.js");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});
const config = require("./config");

app.use(require("body-parser").json());
const cookieSessionMiddleware = cookieSession({
  secret: `Well Hello There`,
  maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(csurf());

app.use(function(req, res, next) {
  res.cookie("mytoken", req.csrfToken());
  next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static("./public"));

app.get("/", (req, res) => {
  if (!req.session.id) {
    res.redirect("/welcome");
  }
  res.sendFile(__dirname + "/index.html");
});

///////////////////////////////resgister

app.get("/welcome", (req, res) => {
  if (req.session.id) {
    res.redirect("/");
  }
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", (req, res) => {
  hashPass(req.body.pass)
    .then(hashCode => {
      return register(
        req.body.name,
        req.body.surname,
        req.body.email,
        hashCode
      );
    })
    .then(function(result) {
      req.session.id = result.rows[0].id;
      req.session.name = result.rows[0].name;
      req.session.surname = result.rows[0].surname;
      req.session.url = result.rows[0].url;
      req.session.bio = result.rows[0].bio;

      res.json({
        success: true
      });
    })
    .catch(function(err) {
      res.json({
        success: false
      });
      console.log(err);
    });
});

///////////////////////////////login

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.pass) {
    res.json({
      success: false
    });
  } else {
    return logIn(req.body.email)
      .then(result => {
        return checkPass(req.body.pass, result.rows[0].password).then(
          doesMatch => {
            if (doesMatch) {
              req.session.id = result.rows[0].id;
              req.session.name = result.rows[0].name;
              req.session.surname = result.rows[0].surname;
              req.session.url =
                result.rows[0].url ||
                "https://vignette.wikia.nocookie.net/bignate/images/6/6e/No_Image_Profile_Pic.jpg/revision/latest?cb=20171015172750";
              req.session.bio = result.rows[0].bio;

              res.json({
                success: true
              });
            } else {
              throw new Error();
            }
          }
        );
      })
      .catch(function(err) {
        res.json({
          success: false
        });
        console.log(err);
      });
  }
});

///////////////////////////////Logout
app.get("/logout", function(req, res) {
  req.session = null;
  res.redirect("/");
});

/////////////////////////////////////App
app.get("/user", (req, res) => {
  res.json({
    id: req.session.id,
    name: req.session.name,
    surname: req.session.surname,
    url:
      req.session.url ||
      "https://vignette.wikia.nocookie.net/bignate/images/6/6e/No_Image_Profile_Pic.jpg/revision/latest?cb=20171015172750",
    bio: req.session.bio
  });
});

///////////////////////////////////upload
app.post("/upload", uploader.single("file"), upload, (req, res) => {
  if (req.file) {
    changeUrl(config.s3Url + req.file.filename, req.session.id)
      .then(({ rows }) => {
        req.session.url = rows[0].url;
        res.json(rows[0]);
      })
      .catch(() => {
        res.status(500).json({
          success: false
        });
      });
  }
});
//////////////////////////////////////////userInfo

app.post("/userBio/:bio", (req, res) => {
  return changeBio(req.params.bio, req.session.id)
    .then(({ rows }) => {
      req.session.bio = rows[0].bio;
      res.json({
        bio: rows[0].bio
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false
      });
    });
});

/////////////////////////////////////////////////get other users

app.get("/getUser/:userId", (req, res) => {
  if (req.params.userId == req.session.id) {
    res.json({
      redirect: true
    });
  } else {
    return Promise.all([
      getOtherProfile(req.params.userId),
      getFriendsOnProfile(req.params.userId)
    ])
      .then(result => {
        res.json({
          otherProfile: result[0].rows[0],
          friends: result[1].rows
        });
      })
      .catch(e => console.log("Error in getUser::", e));
  }
});
///////////////////////////////////////Get initial status

app.get("/getFriendshipStatus/:searchId", (req, res) => {
  return checkForFriendStatus(req.session.id, req.params.searchId).then(
    ({ rows }) => {
      if (rows.length === 0) {
        res.json({
          getFriendshipStatus: { status: null }
        });
      } else {
        res.json({
          getFriendshipStatus: rows[0]
        });
      }
    }
  );
});

/////////////////////////////////////////////////////get friendshipButton

app.post("/friendshipButton/:userId", (req, res) => {
  return sendFriendRequest(req.session.id, req.params.userId)
    .then(({ rows }) => {
      res.json({ frienshipStatusUpdate: rows[0] });
    })
    .then(result => {
      for (key in onlineUsers) {
        if (onlineUsers[key] == req.params.userId) {
          let socketReceiverId = key;
          io.sockets.sockets[socketReceiverId].emit("alert", {
            message: "You have an Alliance Request from: ",
            senderName: req.session.name,
            senderSurname: req.session.surname
          });
        }
      }
    })
    .catch(() => {
      res.status(500).json({
        success: false
      });
    });
});

//////////////////////////////////////////////////////////UPDATE status
app.post("/updateFriendship/:userId", (req, res) => {
  return changeFriendStatus(req.session.id, req.params.userId)
    .then(({ rows }) => {
      res.json({ frienshipStatusUpdate: rows[0] });
    })
    .then(result => {
      for (key in onlineUsers) {
        if (onlineUsers[key] == req.params.userId) {
          let socketReceiverId = key;
          io.sockets.sockets[socketReceiverId].emit("alert", {
            message: "Your Alliance request has been accepted by:  ",
            senderName: req.session.name,
            senderSurname: req.session.surname
          });
        }
      }
    })
    .catch(() => {
      res.status(500).json({
        success: false
      });
    });
});

///////////////////////////////////////////////////Delete REQ
app.post("/deleteFriend/:userId", (req, res) => {
  return deleteFriend(req.session.id, req.params.userId)
    .then(result => {
      res.json({
        status: null
      });
    })
    .then(result => {
      for (key in onlineUsers) {
        if (onlineUsers[key] == req.params.userId) {
          let socketReceiverId = key;
          io.sockets.sockets[socketReceiverId].emit("alert", {
            message: "You have now a new Enemy called ",
            senderName: req.session.name,
            senderSurname: req.session.surname
          });
        }
      }
    });
});

//////////////////////////////////////////////////////Get friends + Request on updateImage

app.get("/getWannabeFriends/:id", (req, res) => {
  return getWannabeFriends(req.session.id).then(({ rows }) => {
    if (rows.length === 0) {
      res.json({
        getFriendshipStatus: { status: null }
      });
    } else {
      res.json({
        rows
      });
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////DO NOT DELETE////////////////////////////////////////////

server.listen(8080, function() {
  console.log("I'm listening.");
});

////////////////////////////////////////////////////io connection
let onlineUsers = {};

io.on("connection", function(socket) {
  console.log(`socket with id ${socket.id} has connected`);
  if (!socket.request.session || !socket.request.session.id) {
    return socket.disconnect(true);
  }
  const socketId = socket.id;
  const userId = socket.request.session.id;
  onlineUsers[socketId] = userId;

  let arrayOfUserIds = Object.values(onlineUsers);
  let userDetails = [
    {
      id: socket.request.session.id,
      name: socket.request.session.name,
      surname: socket.request.session.surname,
      url: socket.request.session.url
    }
  ];

  getUsersByIds(arrayOfUserIds)
    .then(({ rows }) => {
      socket.emit("onlineUsers", rows);
    })
    .catch(e => {
      console.log("Error in getUsersByIds:: ", e);
    });

  if (Object.values(onlineUsers).filter(id => id == userId).length == 1) {
    socket.broadcast.emit("userJoined", userDetails[0]);
  }
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    if (!Object.values(onlineUsers).includes(userId)) {
      console.log(`socket with id ${socket.id} has left`);
      socket.broadcast.emit("userLeft", userId);
    }
  });
  getRecentChatMsgs().then(msgs => {
    socket.emit("chatMessages", msgs.rows.reverse());
  });

  socket.on("chat", msg => {
    addMsg(userId, msg)
      .then(resp => {
        let msgInfo = Object.assign({}, userDetails[0], resp.rows[0]);
        console.log("msgInfo", msgInfo);
        io.sockets.emit("chatMessage", msgInfo);
      })
      .catch(e => {
        console.log("Error in chat:: ", e);
      });
  });
});
