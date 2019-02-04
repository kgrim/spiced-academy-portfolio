(function() {
    Vue.component("imgmodal", {
        data: function() {
            return {
                id: "",
                url: "",
                title: "",
                username: "",
                description: "",
                created_at: ""
            };
        },
        methods: {
            close: function() {
                this.$emit("close");
            }
        },
        watch: {
            id: function() {
                let self = this;
                axios.get("/image/" + this.id).then(function(res) {
                    console.log("this inside axios", this);
                    if (!res.data.image) {
                        self.close();
                    } else {
                        self.url = res.data.image.url;
                        self.id = res.data.image.id;
                        self.title = res.data.image.title;
                        self.username = res.data.image.username;
                        self.description = res.data.image.description;
                        self.created_at = res.data.image.created_at;
                    }
                });
            }
        },
        template: "#popupmodal",
        props: ["id"],
        mounted: function() {
            let self = this;
            axios.get("/image/" + this.id).then(function(res) {
                if (!res.data) {
                    self.close();
                } else {
                    self.url = res.data.image.url;
                    self.id = res.data.image.id;
                    self.title = res.data.image.title;
                    self.username = res.data.image.username;
                    self.description = res.data.image.description;
                    self.created_at = res.data.image.created_at;
                }
            });
        }
    });

    ////////////////////////////////////////////////////////////

    Vue.component("comments-section", {
        data: function() {
            return {
                dialouge: [],
                comments: {
                    comment: "",
                    username: ""
                }
            };
        },
        template: "#comments",
        props: ["id"],
        mounted: function() {
            let self = this;
            axios
                .get("/comments/" + self.id)
                .then(function(res) {

                    self.dialouge = res.data;
                })
                .catch(function(err) {
                    console.log(err);
                }); // close function in mounted
        },
        watch: {
            id: function() {
                let self = this;
                axios
                    .get("/comments/" + self.id)
                    .then(function(res) {
                        self.dialouge = res.data;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        },
        methods: {
            uploadComment: function(e) {
                e.preventDefault();
                let self = this;
                console.log("self.id ", self.id);
                console.log("this.comments: ", this.comments);

                axios
                    .post("/uploadComments/" + self.id, this.comments)
                    .then(function(resp) {
                        console.log("resp.Data ", resp.data);
                        self.dialouge.unshift(resp.data[0]);
                        self.comments.comment = "";
                        self.comments.username = "";
                    });
            }
        },
        watch: {
            id: function() {
                let self = this;

                axios
                    .get("/comments/" + self.id)
                    .then(function(res) {
                        self.dialouge = res.data;
                        console.log("self: ", self);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }
    });

    ////////////////////////////////////////////////////////////

    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            lastIdDatabase: null,
            form: {
                title: "",
                username: "",
                description: ""
            }, // close object in data object
            id: location.hash.length > 1 && location.hash.slice(1),
            more: []
        }, // close data object
        mounted: function() {
            window.addEventListener("hashchange", function() {
                app.id = location.hash.slice(1);
            });
            axios
                .get("/imageboard")
                .then(function(res) {
                    console.log("res in Imageboard: ", res.data);

                    app.images = res.data.images;
                    app.lastIdDatabase = res.data.lastIdDatabase;
                    // if (app.lastIdDatabase < 11) {
                    //     app.more = true;
                    // } else {
                    //     app.more = false;
                    // }
                })
                .catch(function(err) {
                    console.log(err);
                }); // close function in mounted
        }, // close mounted
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                // console.log("vue instance: ", this.form); //'this' refers to the object that it is on. In this case app will work as well
                var file = $('input[type="file"]').get(0).files[0];
                // console.log("file that we just uploaded: ", file);

                var formData = new FormData();
                formData.append("file", file); // we use this only for files!

                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                // console.log("formData: ", formData); // this will never display the information in it
                axios.post("/upload", formData).then(function(resp) {
                    console.log("resp.Data ", resp.data);
                    app.images.unshift(resp.data.image);
                    app.images.pop();
                    app.form.title = "";
                    app.form.username = "";
                    app.form.description = "";
                });
            }, //close uploadFile
            hide: function() {
                this.id = null;
                location.hash = "";
            },
            showImage: function(imageSerialId) {
                this.id = imageSerialId;
                location.hash = imageSerialId;
            },
            showMore: function() {
                var lastId = this.images[this.images.length - 1].id;
                axios.get("/getmore/" + lastId).then(function(result) {
                    app.lastIdDatabase = result.data.id;
                    var lastIdInResult =
                        result.data.images[result.data.images.length - 1].id;

                    for (var i = 0; i < result.data.images.length; i++) {
                        app.images.push(result.data.images[i]);
                    }

                    if (app.lastIdDatabase === lastIdInResult) {
                        app.more = false;

                        console.log("this.more: false", app.more);
                    } else {
                        app.more = true;

                    }
                });
            }
        } //close methods
    }); // close vue instance
})(); //close iffe
