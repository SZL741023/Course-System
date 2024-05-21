const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("In course route.");
  next();
});

// 獲得 DB 中所有的課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    console.log(courseFound);
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師id來搜尋課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  try {
    let courseFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用學生id 來搜尋課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  try {
    let courseFound = await Course.find({ student: _student_id })
      .populate("student", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程名稱來搜尋課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    console.log(courseFound);
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程id來搜尋課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "only instructor can create new course. If you are an instructor, please login instructor account.",
      );
  }
  let { title, description, price } = req.body;
  try {
    const newCourse = Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let saveCourse = await newCourse.save();
    return res.send({
      message: "new course is saved.",
      saveCourse,
    });
  } catch (e) {
    return res.status(500).send("can not create course.");
  }
});

// 讓學生透過id來註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    courseFound.student.push(req.user._id);
    await courseFound.save();
    res.send("註冊完成。");
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // 確認課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新。");
    }
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程已更新成功!",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程老師，才能修改課程內容。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(401).send("找不到課程，無法刪除。");
    }
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id });
      return res.send("成功刪除課程。");
    } else {
      return res.status(403).send("只有此課程老師，才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
