import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import {
  Alert,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  styled,
} from "@mui/material";

import PublishIcon from "@mui/icons-material/Publish";
import Person2Icon from "@mui/icons-material/Person2";

import "./AddUser.css";
import axios, { axiosPrivate } from "../api/axios";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useEffect } from "react";
import { useState } from "react";

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
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    age: yup.number().positive().integer().required(),
    password: yup.string().required(),
    role: yup.string().required(),
    institution: yup.number(),
  })
  .required();

export default function AddUSer() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  

  const { auth } = useContext(AuthContext);
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

      // console.log("Access Token 123: ",accessToken);
      const response = await axios.post("/api/v1/users/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("User added successfully:", response.data);
      setSnackbarMessage("User added successfully");
      setOpenSnackbar(true);
      reset();
    } catch (error) {
      console.error("Error adding/updating user:", error);
      setSnackbarMessage("Failed to add user");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="UserForm">
      <Typography variant="h4" sx={{ textAlign: "center", marginY: "50px" }}>
        Add New User
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="addForm">
        <StyledTextField
          {...register("first_name")}
          id="outlined-basic"
          label="First Name"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.firstName?.message}</Typography>

        <StyledTextField
          {...register("last_name")}
          id="outlined-basic"
          label="Last Name"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.lastName?.message}</Typography>

        <StyledTextField
          {...register("email")}
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.email?.message}</Typography>

        <StyledTextField
          {...register("password")}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.password?.message}</Typography>

        <StyledTextField
          {...register("age")}
          id="outlined-basic"
          label="Age"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.age?.message}</Typography>
        <InputLabel id="demo-simple-select-label">User Type</InputLabel>
        <Select
          {...register("role")}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          sx={{ width: "200px" }}
        >
          <MenuItem value={"student"}>Student</MenuItem>
          <MenuItem value={"teacher"}>Teacher</MenuItem>
        </Select>

        <Button
          endIcon={<PublishIcon />}
          variant="contained"
          type="submit"
          sx={{
            width: "150px",
            bgcolor: "green",
            background: "linear-gradient(120deg,  #bc18dd 30%, #a4dae7 90%)",
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
