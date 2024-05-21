const router = require("express").Router();
const registerValidation = require("../validation").registValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("In auth router...");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("Connected Successfully...");
});

router.post("/register", async (req, res) => {
  // console.log("Sign up user.");
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("This email is signed up.");
  console.log(req.body);

  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  console.log(newUser);
  try {
    let savedUser = await newUser.save();
    return res.send({ mes: "New user is saved.", savedUser });
  } catch (e) {
    return res.status(400).send("Can not save new user.");
  }
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res
      .status(400)
      .send("User is not found, please check email is correct or not...");
  }
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (isMatch) {
      // 製作token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRE);
      return res.send({
        message: "Login Successfully.",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("Password is not correct!!");
    }
  });
});

module.exports = router;
