import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../forms/AddUser.css";

import * as yup from "yup";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  Snackbar,
  Alert,
  Checkbox,
  ListItemText,
} from "@mui/material";

import PublishIcon from "@mui/icons-material/Publish";
import axios, { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";

const StyledTextField = styled(TextField)({
  marginBottom: "10px",
  width: "300px",
  "& label.Mui-focused": { color: "#9c27b0" },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderImage: "linear-gradient(45deg, #9c27b0 30%, #1aa599 90%) 1",
    },
  },
});

const schema = yup
  .object({
    name: yup.string().required("Classroom Name is required"),
    teacher: yup.number().required("Teacher is required"),
    course: yup.number().required("Course is required"),
    enrollments: yup
      .array()
      .of(yup.number())
      .required("Enrollments are required"),
  })
  .required();

export default function AddClassroom() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/users/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const filteredTeachers = "teacher"
          ? response.data.results.filter((user) => user.role === "teacher")
          : response.data.results;

        console.log("Filtered users: ", filteredTeachers);
        setTeachers(filteredTeachers);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };

    const fetchCourses = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/courses/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCourses(response.data.results);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    const fetchStudents = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/users/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const filteredStudent = "student"
          ? response.data.results.filter((user) => user.role === "student")
          : response.data.results;

        setStudents(filteredStudent);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchTeachers();
    fetchCourses();
    fetchStudents();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log({ errors });

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      data.enrollments = enrolledStudents;
      console.log("enrolled: ", data);
      const response = await axios.post("/api/v1/classrooms/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Classroom added successfully:", response.data);

      setSnackbarMessage("Classroom added successfully");
      setOpenSnackbar(true);
      reset();
    } catch (error) {
      console.error("Error adding classroom:", error);
      setSnackbarMessage("Failed to add classroom");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEnrollChange = (event) => {
    const { value } = event.target;  
    setEnrolledStudents(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <div className="UserForm">
      <Typography variant="h4" sx={{ textAlign: "center", marginY: "50px" }}>
        Add New Classroom
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="addForm">
        <StyledTextField
          {...register("name")}
          id="outlined-basic"
          label="Classroom Name"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.name?.message}</Typography>
        <InputLabel>Teacher</InputLabel>
        <Select
          {...register("teacher")}
          labelId="teacher-select-label"
          id="teacher-select"
          label="Teacher"
          sx={{ width: "300px", marginBottom: "10px" }}
        >
          {teachers.map((teacher) => (
            <MenuItem key={teacher.id} value={teacher.id}>
              {teacher.id} - {teacher.first_name} {teacher.last_name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="subtitle1">
          {errors.teacher_id?.message}
        </Typography>
        <InputLabel id="course-select-label">Course</InputLabel>
        <Select
          {...register("course")}
          id="course-select"
          label="Course"
          sx={{ width: "300px", marginBottom: "10px" }}
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.code} - {course.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="subtitle1">{errors.course_id?.message}</Typography>
        <InputLabel>Enroll Students</InputLabel>{" "}
        <Select
          {...register("enrollments")}
          labelId="student-select-label"
          multiple
          label="Enroll Students"
          sx={{ width: "300px", marginBottom: "10px" }}
          value={enrolledStudents}
          onChange={handleEnrollChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {`${student.first_name} ${student.last_name}`}
            </MenuItem>
          ))}
        </Select>
        <Button
          endIcon={<PublishIcon />}
          variant="contained"
          type="submit"
          sx={{
            width: "150px",
            bgcolor: "green",
            background: "linear-gradient(120deg, #bc18dd 30%, #a4dae7 90%)",
            marginTop: "30px",
          }}
        >
          Submit
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            snackbarMessage.includes("successfully") ? "success" : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
