import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "../forms/AddUser.css";

import * as yup from "yup";
import {
  Button,
  TextField,
  Typography,
  styled,
  Snackbar,
  Alert,
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
    name: yup.string().required("Course Name is required"),
    code: yup.string().required("Code is required"),
    institution: yup.number(),
  })
  .required();

export default function AddCourse() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const ins = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/users/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        localStorage.setItem("institution", response.data.institution);
        localStorage.setItem("role", response.data.role);
      } catch (err) {
        console.error(err);
      }
    };

    ins();
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

  const onSubmit = async (data) => {
    const institution = localStorage.getItem("institution");
    data.institution = institution;

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post("/api/v1/courses/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Course added successfully:", response.data);
      setSnackbarMessage("Course added successfully");
      setOpenSnackbar(true);
      reset(); 
    } catch (error) {
      console.error("Error adding/updating course:", error);
      setSnackbarMessage("Failed to add course");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="UserForm">
      <Typography variant="h4" sx={{ textAlign: "center", marginY: "50px" }}>
        Add New Course
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="addForm">
        <StyledTextField
          {...register("name")}
          label="Course Name"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.course_name?.message}</Typography>

        <StyledTextField
          {...register("code")}
          label="Code"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.description?.message}</Typography>

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
          severity={snackbarMessage.includes("successfully") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
