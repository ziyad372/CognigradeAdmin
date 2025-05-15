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
import OMRSubmissionList from "./components/OMRSubmissionList";
import AdminHome from "./components/AdminHome";
import TheorySubmissionsList from "./components/TheorySubmissionList";

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
        path="/SubmitTheoryList"
        exact
        element={
          <RoleRoute allowedRoles={["student"]}>
            <SubmitTheoryList />
          </RoleRoute>
        }
      />
      <Route
        path="/SubmitTheory/:theoryId"
        exact
        element={
          <RoleRoute allowedRoles={["student"]}>
            <SubmitTheory />
          </RoleRoute>
        }
      />

      <Route
        path="/CreateTheory"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <CreateTheory />
          </RoleRoute>
        }
      />
      <Route
        path="/TheoryList"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <TheoryList />
          </RoleRoute>
        }
      />
      <Route
        path="/GeneratingOMR_1"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <GeneratingOMR_1 />
          </RoleRoute>
        }
      />
      <Route
        path="/OMRList"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <OMRList />
          </RoleRoute>
        }
      />
      <Route
        path="/createOMR"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <CreateOMR />
          </RoleRoute>
        }
      />
      <Route
        path="/addClassroom"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <AddClassroom />
          </RoleRoute>
        }
      />
      <Route
        path="/classroomList"
        exact
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <ClassroomList />
          </RoleRoute>
        }
      />

      <Route
        path="/addUser"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AddUSer />
          </RoleRoute>
        }
      />

      <Route
        path="/adminHome"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminHome />
          </RoleRoute>
        }
      />
      <Route
        path="/userList"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <UserList />
          </RoleRoute>
        }
      />
      <Route
        path="/addCourse"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AddCourse />
          </RoleRoute>
        }
      />
      <Route
        path="/courseList"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <CourseList />
          </RoleRoute>
        }
      />
      <Route
        path="/OMRSubmissionList"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <OMRSubmissionList />
          </RoleRoute>
        }
      />
      <Route
        path="/TheorySubmissionsList"
        exact
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <TheorySubmissionsList />
          </RoleRoute>
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

function RoleRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (role === "admin" || allowedRoles.includes(role)) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}


export default App;
