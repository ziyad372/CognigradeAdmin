import "./App.css";
import AddUSer from "./forms/AddUser";
import SideBar from "./components/SideBar";
import LogIn from "./components/LogIn";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import UserList from "./components/UserList";
import { axiosPrivate } from "./api/axios";
import Home from "./components/Home";
import AddCourse from "./components/addCourse";
import CourseList from "./components/CourseList";
import AddClassroom from "./components/AddClassroom";
import ClassroomList from "./components/ClassroomList";
import CreateOMR from "./components/CreateOMR";
import OMRList from "./components/OMRList";
import GeneratingOMR from "./components/GeneratingOMR";
import CreateTheory from "./components/CreateTheory";
import TheoryList from "./components/TheoryList";
import GeneratingOMR_1 from "./components/GenerateOMR_1";
import SubmitTheory from "./components/SubmitTheory";
import SubmitTheoryList from "./components/SubmitTheoryList";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/generatingOMR" exact element={<GeneratingOMR />} />

            <Route path="/login" exact element={<LogIn />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SideBar />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        // alignItems: "center",
                        width: "100%",
                        overflowY: "auto",
                      }}
                    >
                      <AppRoutes />
                    </div>
                  </div>
                  {/* </div> */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" exact element={<Home />} />
      <Route
        path="/addUser"
        exact
        element={
          <AdminElement>
            <AddUSer />
          </AdminElement>
        }
      />
      <Route
        path="/userList"
        exact
        element={
          <AdminElement>
            <UserList />
          </AdminElement>
        }
      />
      <Route
        path="/addCourse"
        exact
        element={
          <AdminElement>
            <AddCourse />
          </AdminElement>
        }
      />
      <Route
        path="/courseList"
        exact
        element={
          <AdminElement>
            <CourseList />
          </AdminElement>
        }
      />
      <Route
        path="/addClassroom"
        exact
        element={
          <AdminElement>
            <AddClassroom />
          </AdminElement>
        }
      />
      <Route
        path="/classroomList"
        exact
        element={
          <AdminElement>
            <ClassroomList />
          </AdminElement>
        }
      />
      <Route
        path="/createOMR"
        exact
        element={
          <AdminElement>
            <CreateOMR />
          </AdminElement>
        }
      />
      <Route
        path="/OMRList"
        exact
        element={
          <AdminElement>
            <OMRList />
          </AdminElement>
        }
      />
      <Route
        path="/CreateTheory"
        exact
        element={
          <AdminElement>
            <CreateTheory />
          </AdminElement>
        }
      />
      <Route
        path="/TheoryList"
        exact
        element={
          <AdminElement>
            <TheoryList />
          </AdminElement>
        }
      />
      <Route
        path="/GeneratingOMR_1"
        exact
        element={
          <AdminElement>
            <GeneratingOMR_1/>
          </AdminElement>
        }
      />
      <Route
        path="/SubmitTheoryList"
        exact
        element={
          
            <SubmitTheoryList/> 
          
        }
      />
      <Route
        path="/SubmitTheory/:theoryId"
        exact
        element={
            <SubmitTheory/> 
        }
      />
      
    </Routes>


  );
}

function AdminElement({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  const response = axiosPrivate
    .get("/api/v1/users/me/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      console.log(response);
      localStorage.setItem("role", response.data.role);
    })
    .catch((err) => {
      console.log(err);
    });

  const userType = localStorage.getItem("role");

  if (userType == "admin") {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  if (token) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
