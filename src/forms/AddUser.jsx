import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import PublishIcon from '@mui/icons-material/Publish';
import Person2Icon from '@mui/icons-material/Person2';

import "./AddUser.css"

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    age: yup.number().positive().integer().required(),
    password: yup.string().required(),
    role: yup.string().required(),
  })
  .required();

export default function AddUSer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => console.log(data);

  return (
    <div className="UserForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("firstName")}
          
          id="outlined-basic"
          label="First Name"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.firstName?.message}</Typography>

        <TextField
          {...register("lastName")}
          id="outlined-basic"
          label="Last Name"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.lastName?.message}</Typography>

        <TextField
          {...register("email")}
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.email?.message}</Typography>

        <TextField
          {...register("password")}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.password?.message}</Typography>

        <TextField
          {...register("age")}
          id="outlined-basic"
          label="Age"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.age?.message}</Typography>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          {...register("role")}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
        >
          <MenuItem value={"Student"}>Student</MenuItem>
          <MenuItem value={"Teacher"}>Teacher</MenuItem>
        </Select>

        <Button endIcon= {<PublishIcon/>} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
