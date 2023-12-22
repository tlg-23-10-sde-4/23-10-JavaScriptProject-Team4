const express = require("express");
const db = require("./connection/connection.js");
const cors = require("cors");
const { get } = require("mongoose");

db.on("error", (error) => console.error(error));

db.once("open", () => console.log("Successfully Connected to our mongodb"));

const app = express();

const users = [];
let current_user = "";
const favorites = {};

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//signup functions
app.post("/signup", function (req, res) {
  if (users.includes(req.body.userId)) {
    res.redirect("/alreadyTaken");
  } else {
    users.push(req.body.userId);
    res.redirect("/signup");
  }
});
app.get("/signup", function (req, res) {
  res.send({ status: "true" });
});
app.get("/alreadyTaken", function (req, res) {
  res.send({ status: "That user already exists! please try again." });
});

//login functions
app.post("/login", function (req, res) {
  if (users.includes(req.body.userId)) {
    res.redirect("/login");
  } else {
    res.redirect("/invalid");
  }
});
app.get("/login", function (req, res) {
  res.send({ status: "true", favorites });
});
app.get("/invalid", function (req, res) {
  res.send({ status: "invalid user name or password" });
});

//adding things to categories functions

app.post("/addfavorites", function (req, res) {
  const userId = req.body.userId;
  const fav = req.body.fav;
  console.log(userId);
  console.log(fav);
  favorites[userId] = [favorites[userId], ...fav.values()];
  //   } else {
  // Assume fav is a single item, push it to the array
  //     favorites[userId].push(fav);
  //   }

  res.redirect("/addfavorites");
});

app.get("/addfavorites", function (req, res) {
  res.send(favorites);
});

//listen to port
app.listen(PORT, async () => {
  console.log(`Now listening on port: ${PORT}`);
});
