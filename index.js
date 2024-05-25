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

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRouter);

// course route is protected by jwt.
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRouter,
);

// 只有登入系統的人，才能去新增課程或註冊課程。
app.listen(8080, () => {
  console.log("backend server is listening on prot 8080..");
});
