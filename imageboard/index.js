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

const express = require("express");
const app = express();
const {
    getImgAndTitle,
    saveFile,
    getInfoForPopUp,
    saveComment,
    getComments,
    showImage,
    checkForLastId
} = require("./dbreq.js");
const { upload } = require("./s3.js");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static("./public"));

app.get("/imageboard", (req, res) => {
    Promise.all([getImgAndTitle(), checkForLastId()])
        .then(([resultImg, resultCheck]) => {
            res.json({
                images: resultImg.rows,
                lastIdDatabase: resultCheck.rows[0].id
            });
        })
        .catch(err => {
            console.log("get Imageboard error: ", err);
        });
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
    if (req.file) {
        saveFile(
            config.s3Url + req.file.filename,
            req.body.title,
            req.body.description,
            req.body.username
        )
            .then(({ rows }) => {
                res.json({
                    image: rows[0]
                });
            })
            .catch(() => {
                res.json();
                res.sendStatus(500);
            });
    }
});

app.get("/image/:id", (req, res) => {
    getInfoForPopUp(req.params.id)
        .then(data => {
            res.json({
                image: data.rows[0]
            });
        })
        .catch(() => {
            res.json();
            res.sendStatus(500);
        });
});

app.get("/comments/:id", (req, res) => {
    getComments(req.params.id).then(result => {
        res.json(result.rows);
    });
});

app.post("/uploadComments/:id", (req, res) => {
    saveComment(req.params.id, req.body.comment, req.body.username)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.log("Upload comment post Err: ", err);
            res.status(500).json({
                success: false
            });
        });
});

app.get("/getmore/:lastId", (req, res) => {
    Promise.all([showImage(req.params.lastId), checkForLastId()]).then(
        ([result, resultId]) => {
            res.json({ images: result.rows, id: resultId.rows[0].id });
        }
    );
});

app.listen(8080, () => console.log("listening"));
