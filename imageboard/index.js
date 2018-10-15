var multer = require("multer"); // it will upload the actual files to our computer
var uidSafe = require("uid-safe"); // will take the file and gives it a unique name
var path = require("path"); //

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    }, //what directy will it save into, in this case it is in directy /uploads
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        }); // this will create a completely new name and it will have 24char as stated as an argument in uidSafe(24)
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
}); // takes the diskStorage and will upload and pasing a limit of a file size

// FILE UPLOAD boilerplate
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
            console.log("images:", resultImg.rows);
            console.log("lastIdDatabase:", resultCheck.rows);
        })
        .catch(err => {
            console.log("get Imageboard error: ", err);
        });
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
    console.log("Req.File: ", req.file); // you just need the filename
    console.log("req.body: ", req.body); // info about the title, description & username
    if (req.file) {
        saveFile(
            config.s3Url + req.file.filename,
            req.body.title,
            req.body.description,
            req.body.username
        )
            .then(({ rows }) => {
                console.log("ROWSSSSS: ", { rows });
                res.json({
                    image: rows[0]
                });
            })
            .catch(() => {
                res.json();
                res.sendStatus(500);
            }); // close catch
    } // close if statement (req.file)
}); // app.post for the Upload

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
        console.log(result.rows);
        res.json(result.rows);
    });
});

app.post("/uploadComments/:id", (req, res) => {
    // console.log("IDDDDDDD: ", req.body);
    saveComment(req.params.id, req.body.comment, req.body.username)
        .then(result => {
            console.log("ROWSSSSS 2: ", result.rows);
            res.json(result.rows);
        })
        .catch(err => {
            console.log("Upload comment post Err: ", err);
            res.status(500).json({
                success: false
            });
            // res.
        }); // close catch
}); // app.post for the Upload

app.get("/getmore/:lastId", (req, res) => {
    console.log("In the get more route!!");
    Promise.all([showImage(req.params.lastId), checkForLastId()]).then(
        ([result, resultId]) => {
            res.json({ images: result.rows, id: resultId.rows[0].id });
        }
    );
});

app.listen(8080, () => console.log("listening"));
