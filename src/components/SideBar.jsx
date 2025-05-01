import React, { useContext } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { Button, Typography } from "@mui/material";

export default function SideBar() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("institution");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // const navigate = useNavigate();
  return (
    <div className="SideBar">
      <Typography
        variant="h4"
        sx={{ color: "white", marginY: "30px", marginLeft: "20px" }}
      >
        COGNIGRADE
      </Typography>

      <Button
        onClick={handleLogout}
        variant="text"
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Logout
      </Button>

      <Button
        variant="text"
        onClick={() => navigate("/home")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Home
      </Button>
      <Button
        onClick={() => navigate("/userList")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Users
      </Button>
      <Button
        onClick={() => navigate("/courseList")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Courses
      </Button>
      <Button
        onClick={() => navigate("/classroomList")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Class Rooms
      </Button>
      <Button
        onClick={() => navigate("/OMRList")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        OMR
      </Button>
      <Button
        onClick={() => navigate("/TheoryList")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Theory
      </Button>
      <Button
        onClick={() => navigate("/GeneratingOMR_1")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Print OMR
      </Button>
      <Button
        onClick={() => navigate("/SubmitTheoryList")}
        sx={{ color: "white", fontSize: "20px", marginLeft: "20px" }}
      >
        Submit Theory
      </Button>

      
    </div>
  );
}
