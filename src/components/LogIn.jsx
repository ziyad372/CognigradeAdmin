import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import * as yup from "yup";
import { Alert, Button, styled, TextField, Typography } from "@mui/material";
import { axiosPrivate } from "../api/axios";
import "./Login.css";
import AuthContext, { AuthProvider } from "../context/AuthProvider";
import { useState } from "react";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

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

export default function LogIn() {
  const { setAuth } = React.useContext(AuthContext);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const response = await axiosPrivate
      .post("/api/v1/login/token/", data)
      .then((response) => {
        console.log(response);
        setAuth(response);
        localStorage.setItem("authToken", response.data.refresh);
        localStorage.setItem("accessToken", response.data.access);
        
      })
      .catch((err) => {
        console.log(err);
      });

    const accessToken = localStorage.getItem("accessToken");

    const ins = await axiosPrivate
      .get("/api/v1/users/me/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("institution", response.data.institution);
        localStorage.setItem("role", response.data.role);

        const role = localStorage.getItem("role");
        if (role === "admin") {
          navigate("/adminHome");
        } else {
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="mainSquare">
        <div className="square1">
          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", marginTop: "100px" }}
          >
            Welcome to COGNIGRADE
          </Typography>
          <Typography
            sx={{
              color: "white",
              paddingX: "50px",
              fontWeight: "100",
              fontFamily: "roboto",
              marginTop: "30px",
            }}
          >
            COGNIGRADE is a revolutionary AI-powered project designed to
            automate the grading process for Optical Mark Recognition (OMR)
            sheets and handwritten assignments. By integrating state-of-the-art
            AI technology, COGNIGRADE offers an efficient and accurate solution
            for educational institutions and organizations
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ color: "white", marginLeft: "50px", marginTop: "150px" }}
          >
            ©COGNIGRADE
          </Typography>
        </div>
        <div className="form1">
          <form className="login" onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", paddingY: "40px" }}
            >
              USER LOGIN
            </Typography>
            <StyledTextField
              {...register("email")}
              id="outlined-basic"
              label="email"
              variant="outlined"
            />
            <Typography variant="subtitle1">{errors.email?.message}</Typography>

            <StyledTextField
              {...register("password")}
              id="outlined-basic"
              label="password"
              variant="outlined"
            />
            <Typography variant="subtitle1">
              {errors.password?.message}
            </Typography>
            <Button
              variant="contained"
              type="submit"
              sx={{
                width: "150px",
                bgcolor: "green",
                background:
                  "linear-gradient(120deg,  #bc18dd 30%, #a4dae7 90%)",
              }}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
