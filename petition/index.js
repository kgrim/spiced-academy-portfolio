const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
var csurf = require("csurf");
const hb = require("express-handlebars");
const {
    insertSignature,
    userCount,
    getSignature,
    logIn,
    register,
    checkPass,
    hashPass,
    getSigByUserId,
    userInfo,
    showSignersInfo,
    citySelection,
    editUsersDb,
    editUserProfilesDb,
    editUsersDbWithoutPass,
    extractUserInfo,
    deleteSig
} = require("./dbreq.js");

app.use(express.static("public"));
app.engine(
    "handlebars",
    hb({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    cookieSession({
        secret: `Well Hello There`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});


function checkForLogin(req, res, next) {
    if (!req.session.loginId) {
        if (!req.url == "/register" || !req.url == "/login") {
            res.redirect("/register");
        } else {
            next();
        }
    } else {
        next();
    }
}

function checkForSigId(req, res, next) {
    if (!req.session.signatureId) {
        res.redirect("/petition");
    } else {
        next();
    }
}

///////////////////////////////resgister
app.get("/register", (req, res) => {
    if (req.session.loginId) {
        res.redirect("/thankyou");
    } else {
        res.render("register");
    }
});

app.post("/register", (req, res) => {
    if (
        !req.body.name.length ||
        !req.body.surname.length ||
        !req.body.email.length ||
        !req.body.password.length
    ) {
        res.render("register", {
            error: true
        });
    } else {
        hashPass(req.body.password)
            .then(hashCode => {
                return register(
                    req.body.name,
                    req.body.surname,
                    req.body.email,
                    hashCode
                );
            })
            .then(function(result) {
                req.session.loginId = result.rows[0].id;
                res.redirect("/profile");
            })
            .catch(function(err) {
                res.render("register", {
                    error: true
                });
                console.log(err);
            });
    }
});

///////////////////////////////login
app.get("/login", checkForLogin, (req, res) => {
    if (req.session.loginId) {
        res.redirect("/thankyou");
    } else {
        res.render("login");
    }
});

app.post("/login", (req, res) => {
    if (!req.body.email.length || !req.body.password.length) {
        res.render("login", {
            error: true
        });
    } else {
        return logIn(req.body.email)
            .then(result => {
                return checkPass(
                    req.body.password,
                    result.rows[0].password
                ).then(doesMatch => {
                    if (doesMatch) {
                        req.session.loginId = result.rows[0].id;
                        return getSigByUserId(req.session.loginId).then(
                            sigInitialId => {
                                if (!sigInitialId.rows.length) {
                                    res.redirect("/petition");
                                } else {
                                    req.session.signatureId =
                                        sigInitialId.rows[0].id;
                                    res.redirect("/thankyou");
                                }
                            }
                        );
                    } else {
                        throw new Error();
                    }
                });
            })
            .catch(function(err) {
                res.render("logIn", {
                    error: true
                });
                console.log(err);
            });
    }
});

///////////////////////////////Logout
app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/register");
});

///////////////////////////////profile
app.get("/profile", function(req, res) {
    res.render("userprofiles", {});
});

app.post("/profile", (req, res) => {
    let url;
    if (req.body.url.length) {
        if (
            !req.body.url.startsWith("https") ||
            !req.body.url.startsWith("http")
        ) {
            url = "https://" + req.body.url;
        }
    }
    userInfo(req.body.age, req.body.city, url, req.session.loginId)
        .then(res.redirect("/petition"))
        .catch(function(err) {
            console.log(err);
        });
});

///////////////////////////////petition
app.get("/petition", (req, res) => {
    if (req.session.signatureId && req.session.loginId) {
        res.redirect("/thankyou");
    }
    if (req.session.loginId && !req.session.signatureId) {
        res.render("petition");
    } else {
        res.redirect("/register");
    }
});

app.post("/petition", (req, res) => {
    if (!req.body.signature) {
        res.render("petition", {
            error: true
        });
    } else {
        insertSignature(req.body.signature, req.session.loginId)
            .then(result => {
                req.session.signatureId = result.rows[0].id;
            })
            .then(() => {
                res.redirect("/thankyou");
            })
            .catch(function(err) {
                res.render("petition", {
                    error: true
                });
                console.log(err);
            });
    }
});

///////////////////////////////editprofile
app.get("/editprofile", (req, res) => {
    extractUserInfo(req.session.loginId)
        .then(userInfo => {
            res.render("editprofile", {
                userInfo: userInfo.rows
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/editprofile", (req, res) => {
    const { name, surname, email, age, city } = req.body;
    let hashedPassword;
    let newProfileUrl;
    if (req.body.url.length) {
        if (
            !req.body.url.startsWith("https") ||
            !req.body.url.startsWith("http")
        ) {
            newProfileUrl = "https://" + req.body.url;
        }
    }
    if (req.body.password.length) {
        hashPass(req.body.password)
            .then(hashedPass => {
                Promise.all([
                    editUsersDb(
                        name,
                        surname,
                        email,
                        hashedPass,
                        req.session.loginId
                    ),
                    editUserProfilesDb(
                        age,
                        city,
                        newProfileUrl,
                        req.session.loginId
                    )
                ])
                    .then(() => {
                        res.redirect("/thankyou");
                    })
                    .catch(err => {
                        console.log(
                            "edit profile WITH password entry Error: ",
                            err
                        );
                    });
            })
            .catch(err => {
                console.log(
                    "edit profile WITH password entry After promise all  Error: ",
                    err
                );
            });
    } else {
        Promise.all([
            editUsersDbWithoutPass(name, surname, email, req.session.loginId),
            editUserProfilesDb(age, city, newProfileUrl, req.session.loginId)
        ])
            .then(() => {
                res.redirect("/thankyou");
            })
            .catch(err => {
                console.log("edit profile without password entry Error: ", err);
            });
    }
});

///////////////////////////////signatures-city
app.get("/signatures/:city", (req, res) => {
    citySelection(req.params.city)
        .then(petitioners => {
            res.render("signaturepage", {
                petitioners: petitioners.rows
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

///////////////////////////////thankyou

app.get("/thankyou", checkForLogin, checkForSigId, (req, res) => {
    let signID = req.session.signatureId;
    Promise.all([userCount(), getSignature(signID)]).then(results => {
        res.render("thankyou", {
            count: results[0].rows[0].count,
            sign: results[1].rows[0].signature
        });
    });
});

///////////////////////////////Delete signature

app.post("/thankyou", (req, res) => {
    deleteSig(req.session.loginId)
        .then(() => {
            delete req.session.signatureId;
        })
        .then(() => {
            res.redirect("/petition");
        })
        .catch(function(err) {
            console.log(err);
        });
});

///////////////////////////////signatures
app.get("/signatures", checkForLogin, checkForSigId, (req, res) => {
    showSignersInfo()
        .then(petitioners => {
            res.render("signaturepage", {
                petitioners: petitioners.rows,
                cityLink: false
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

////////////////////////////////////////////////////
app.get("*", function(req, res) {
    res.redirect("/register");
});

app.listen(process.env.PORT || 8080, () => console.log("listening"));
