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
    dbUrl = `postgres:postgres:${secret.secret}@localhost:5432/petition`;
}

const db = spicedPg(dbUrl);

module.exports.insertSignature = function(signature, user_id) {
    return db.query(
        "INSERT INTO signatures (signature, user_id) VALUES($1,$2) RETURNING id",
        [signature, user_id]
    );
};

module.exports.getSignature = function(signID) {
    return db.query("SELECT signature, id FROM signatures WHERE id = $1", [
        signID
    ]);
};

module.exports.userCount = function() {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};

module.exports.register = function(name, surname, email, password) {
    return db.query(
        "INSERT INTO users (name, surname, email, password) VALUES($1,$2,$3,$4) RETURNING id",
        [name, surname, email, password]
    );
};

module.exports.logIn = function(email) {
    return db.query(`SELECT id, password FROM users WHERE email = $1 `, [
        email
    ]);
};

exports.hashPass = pass => {
    return genSalt().then(salt => {
        return hash(pass, salt);
    });
};

exports.checkPass = (pass, hash) => {
    return compare(pass, hash);
};

exports.getSigByUserId = userId => {
    return db.query(`SELECT id FROM signatures WHERE user_id = $1 `, [userId]);
};

module.exports.userInfo = (age, city, url, user_id) => {
    return db.query(
        "INSERT INTO user_profiles (age, city, url, user_id) VALUES($1, $2, $3, $4) RETURNING id",
        [age || null, city || null, url || null, user_id]
    );
};

module.exports.showSignersInfo = () => {
    return db.query(
        `SELECT users.name, users.surname, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id`
    );
};

module.exports.citySelection = city => {
    return db.query(
        `SELECT users.name, users.surname, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN signatures
        ON users.id = signatures.user_id
        WHERE user_profiles.city = $1`,
        [city]
    );
};

module.exports.extractUserInfo = id => {
    return db.query(
        `SELECT users.name, users.surname, users.email, user_profiles.age, user_profiles.city, user_profiles.url
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.id = $1`,
        [id]
    );
};

module.exports.editUsersDb = (name, surname, email, password, id) => {
    console.log("DB password:", name, surname, email, password);
    return db.query(
        `UPDATE users
        SET name = $1,
            surname = $2,
            email = $3,
            password = $4
        WHERE id = $5`,
        [name, surname, email, password, id]
    );
};

module.exports.editUsersDbWithoutPass = (name, surname, email, id) => {
    return db.query(
        `UPDATE users
        SET name = $1,
            surname = $2,
            email = $3
        WHERE id = $4`,
        [name, surname, email, id]
    );
};

module.exports.editUserProfilesDb = (age, city, url, user_id) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $1, city = $2, url = $3, user_id = $4`,
        [age || null, city || null, url || null, user_id]
    );
};

module.exports.deleteSig = id => {
    return db.query(`DELETE FROM signatures WHERE user_id = $1`, [id]);
};
