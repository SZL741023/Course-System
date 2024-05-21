import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  let [searchInput, setSearchInput] = useState();
  let [searchResult, setSearchResult] = useState();

  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功。");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log(CourseService.getAllCourse());
    CourseService.getAllCourse().then((data) => {
      setSearchResult(data.data);
    });
  }, []);

  return (
    <div className="p-3">
      {!currentUser && (
        <div>
          <p>在觀看新課程之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "Instructor" && (
        <div>
          <h1>只有學生才能註冊課程。</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleChangeInput}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋課程
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length !== 0 && (
        <div className="d-flex flex-wrap">
          {searchResult.map((course) => {
            return (
              <div key={course._id} className="card mw-25 m-2">
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p className="card-text mx-2">{course.description}</p>
                  <p className="mx-2">學生人數:{course.student.length}</p>
                  <p className="mx-2">課程價格:{course.price}</p>
                  <p className="mx-2">
                    Instructor:{course.instructor.username}
                  </p>
                  <button
                    id={course._id}
                    className="btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
