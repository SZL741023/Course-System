import axios from "axios";
const API_URL = "https://course-system-603a10b59f99.herokuapp.com/api/courses";

class CourseService {
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      },
    );
  }

  getAllCourse() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL, { headers: { Authorization: token } });
  }
  // 使用學生id，找到學生註冊的課程。
  getEnrolledCourses(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 使用老師id，找到老師的課程。
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 使用課程名稱搜尋課程
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/findByName/" + name, {
      headers: { Authorization: token },
    });
  }

  enroll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    );
  }
}
const courseService = new CourseService();
export default courseService;
