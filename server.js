const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const authRouter = require("./routes").auth;
const courseRouter = require("./routes").courses;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8080; // process.env.PORT 是 Heroku 的動態設定

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/user", authRouter);

// course route is protected by jwt.
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRouter,
);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// 只有登入系統的人，才能去新增課程或註冊課程。
app.listen(port, () => {
  console.log("backend server is listening on prot 8080..");
});
