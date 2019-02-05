const spicedPg = require("spiced-pg");
const { promisify } = require("util");

let dbUrl;
if (process.env.DATABASE_URL) {
    dbUrl = process.env.DATABASE_URL;
} else {
    const secret = require("./secrets");
    dbUrl = `postgres:postgres:${secret.secret}@localhost:5432/imageboard`;
}
const db = spicedPg(dbUrl);

exports.getImgAndTitle = function() {
    return db.query("SELECT * FROM images ORDER BY id DESC LIMIT 8;");
};

exports.saveFile = function(url, title, description, username) {
    return db.query(
        `INSERT INTO images (url, title, description, username)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, title, description, created_at`,
        [url, title, description, username]
    );
};

exports.getInfoForPopUp = function(id) {
    return db.query(
        `SELECT * FROM images
        WHERE id = $1;`,
        [id]
    );
};
exports.saveComment = function(imageId, comment, username) {
    return db.query(
        `INSERT INTO comments (image_id, comment, username)
        VALUES ($1, $2, $3)
        RETURNING id, image_id, comment, username, created_at`,
        [imageId || null, comment || null, username || null]
    );
};

exports.getComments = function(imageId) {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1 ORDER BY id DESC;`,
        [imageId]
    );
};

exports.showImage = function(lastImageId) {
    return db.query(
        `SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 8;`,
        [lastImageId]
    );
};

exports.checkForLastId = function() {
    return db.query(`SELECT id FROM images ORDER BY id ASC LIMIT 1;`);
};
