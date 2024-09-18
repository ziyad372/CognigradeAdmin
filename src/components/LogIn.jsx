import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { Button, TextField, Typography } from "@mui/material";
import {axiosPrivate} from "../api/axios";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export default function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {

    const response = axiosPrivate.post("/api/v1/login/token/", data).then((response) => {
      console.log(response);
    })
    
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("email")}
          id="outlined-basic"
          label="email"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.email?.message}</Typography>

        <TextField
          {...register("password")}
          id="outlined-basic"
          label="password"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.password?.message}</Typography>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
