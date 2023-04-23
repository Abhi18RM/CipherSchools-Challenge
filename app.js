const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');
const swal = require('sweetalert');

var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb+srv://abhiram-admin:abhiram@cluster0.jjf4d83.mongodb.net/CipherSchools", { useNewUrlParser: true });
mongoose.connect("mongodb://localhost:27017/CipherSchools", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const users = mongoose.model("User", userSchema);

const user1 = new users({
    name: "Abhiram",
    email: "abhiramravuri@gmail.com",
    password: "12345678"
});
const user2 = new users({
    name: "Adarsh",
    email: "adarsh@gmail.com",
    password: "23456789"
});
const user3 = new users({
    name: "Karthik",
    email: "karthik@gmail.com",
    password: "34567890"
});
const user4 = new users({
    name: "Prani",
    email: "prani@gmail.com",
    password: "45678901"
});
const user5 = new users({
    name: "Sandeep",
    email: "sandeep@gmail.com",
    password: "56789012"
});
var userToLog = "";
var wrongPass = false;


app.get("/", async function (req, res) {

    const query = users.find({});
    query.getFilter();
    const doc = await query.exec();
    if (doc.length == 0) {
        user1.save();
        user2.save();
        user3.save();
        user4.save();
        user5.save();
    }
    res.render("login", { passValue: wrongPass });
});

// app.get("/:route", async function (req, res) {
//     if (req.params.route == 'home') {
//         if (userToLog != "") {
//             res.redirect("/home")
//         }
//     }
//     else {
//         res.redirect("/");
//     }
// });

app.get("/home", async function (req, res) {
    console.log("In home section");
    const quer = users.find({ email: userToLog });
    quer.getFilter();
    const document = await quer.exec();
    console.log(document);
    res.render("index", { userName: document[0].name, userEmail: document[0].email });
});


app.post("/", async function (req, res) {
    // console.log(req.body);
    // console.log("Logging in");
    const query = users.findOne({ email: req.body.email });
    query.getFilter();
    const doc = await query.exec();
    if (doc.password == req.body.password) {
        console.log("Logging in...");
        userToLog = req.body.email;
        res.redirect("/home");
        console.log("Logged in");
    }
    else {
        console.log("Wrong Password");
        swal({
            title: "Wrong Password",
            text: "Please enter correct password",
            icon: "error",
        });
        wrongPass = true;
        res.redirect("/");
    }

});

app.post("/logout", async function (req, res) {
    userToLog = "";
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});