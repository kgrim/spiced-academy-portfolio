const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

let dbUrl;
if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
} else {
  const secret = require("./secrets");
  dbUrl = `postgres:postgres:${secret.secret}@localhost:5432/socialnetwork`;
}

const db = spicedPg(dbUrl);

exports.register = function(name, surname, email, password, url, bio) {
  return db.query(
    `INSERT INTO users (name, surname, email, password, url, bio) VALUES($1, $2, $3, $4, $5, $6)
    RETURNING id, name, surname, url, bio`,
    [
      name || null,
      surname || null,
      email || null,
      password || null,
      url ||
        "https://us.123rf.com/450wm/alancotton/alancotton1410/alancotton141000243/32890855-skull-and-crossbones-poison-sign-over-a-black-background.jpg?ver=6",
      bio || null
    ]
  );
};

exports.logIn = function(email) {
  return db.query(
    `SELECT id, password, name, surname, url, bio
      FROM users
      WHERE email = $1 `,
    [email]
  );
};

exports.hashPass = pass => {
  return genSalt().then(salt => {
    return hash(pass, salt);
  });
};

exports.checkPass = (pass, hash) => {
  return compare(pass, hash);
};

exports.changeUrl = function(url, id) {
  return db.query(
    `UPDATE users
      SET url = $1
      WHERE id = $2 RETURNING url`,
    [url, id]
  );
};

exports.changeBio = function(bio, id) {
  return db.query(
    `UPDATE users
      SET bio = $1
      WHERE id = $2 RETURNING bio`,
    [bio, id]
  );
};

exports.getFriendsOnProfile = function(id) {
  return db.query(
    `SELECT users.id, users.name, users.surname, users.url, friendships.status
  FROM friendships
  JOIN users
  ON (users.id = friendships.receiver_id AND status = 2 AND sender_id = $1)
  OR (users.id = friendships.sender_id AND status = 2 AND receiver_id = $1)`,
    [id]
  );
};

exports.getOtherProfile = function(userId) {
  return db.query(
    `SELECT name, surname, url, bio
      FROM users
      WHERE id = $1 `,
    [userId]
  );
};

exports.sendFriendRequest = function(sender_id, receiver_id) {
  return db.query(
    `INSERT INTO friendships (sender_id, receiver_id) VALUES($1, $2)
      RETURNING sender_id, receiver_id, status`,
    [sender_id, receiver_id]
  );
};

exports.checkForFriendStatus = function(sender_id, receiver_id) {
  return db.query(
    `SELECT receiver_id, sender_id, status
        FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
    [sender_id, receiver_id]
  );
};

exports.changeFriendStatus = function(sender_id, receiver_id) {
  return db.query(
    `UPDATE friendships
        SET status = 2
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        RETURNING receiver_id, sender_id, status`,
    [sender_id, receiver_id]
  );
};

exports.deleteFriend = function(sender_id, receiver_id) {
  return db.query(
    `DELETE
        FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
    [sender_id, receiver_id]
  );
};

exports.getWannabeFriends = function(id) {
  return db.query(
    `SELECT users.id, name, surname, url, status
    FROM friendships
    JOIN users
    ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)`,
    [id]
  );
};

exports.getUsersByIds = function(arrayOfIds) {
  return db.query(`SELECT * FROM users WHERE id = ANY($1)`, [arrayOfIds]);
};

exports.getRecentChatMsgs = function() {
  return db.query(
    `SELECT users.id, users.name, users.surname, users.url, chat.id as chatid, chat.sender_id, chat.message, chat.created_at
          FROM chat
          LEFT JOIN users
          ON users.id = sender_id
          ORDER BY chatid DESC
          LIMIT 10`
  );
};

exports.addMsg = function(userId, msg) {
  return db.query(
    `INSERT INTO chat (sender_id, message) VALUES($1, $2)
        RETURNING id as chatid,sender_id,created_at,message`,
    [userId, msg]
  );
};
