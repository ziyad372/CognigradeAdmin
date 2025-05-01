import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  Typography,
  styled,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios, { axiosPrivate } from "../api/axios";
import { useState } from "react";
import "./CreateOMR.css";
import { useEffect } from "react";

const StyledTextField = styled(TextField)({
  marginBottom: "10px",
  minWidth: "300px",
  "& label.Mui-focused": { color: "#9c27b0" },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderImage: "linear-gradient(45deg, #9c27b0 30%, #1aa599 90%) 1",
    },
  },
});

const schema = yup
  .object({
    classroom: yup
      .number()
      .typeError("Classroom ID must be an integer")
      .required("Classroom ID is required"),
    title: yup.string().required("Title is required"),
    questions: yup
      .array()
      .of(
        yup.object({
          answer: yup
            .number()
            .min(1, "Answer must be at least 1")
            .max(4, "Answer must be at most 4")
            .typeError("Classroom ID must be an integer")
            .required("Answer is required"),
        })
      )
      .required("Questions are required"),
  })
  .required();

export default function CreateOMR() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [classrooms, setClassrooms] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    const fetchClassrooms = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/classrooms/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        setClassrooms(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch classrooms:", error);
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post("/api/v1/omr/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("OMR created successfully:", response.data);
      setSnackbarMessage("OMR created successfully");
      setOpenSnackbar(true);
      reset();
    } catch (error) {
      console.error("Error creating OMR:", error);
      setSnackbarMessage("Failed to create OMR");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="OMRForm">
      <Typography variant="h4" sx={{ textAlign: "center", marginY: "50px" }}>
        Create OMR
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="addForm">
        {/* <StyledTextField
          {...register("classroom")}
          id="outlined-basic"
          label="Classroom ID"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.classroom?.message}</Typography> */}
        <Select
          {...register("classroom")}
          id="classroom-select"
          label="Classroom"
          sx={{ width: "300px", marginBottom: "10px" }}
        >
          {classrooms.map((classroom) => (
            <MenuItem key={classroom.id} value={classroom.id}>
              {classroom.id} - {classroom.name}
            </MenuItem>
          ))}
        </Select>
        <StyledTextField
          {...register("title")}
          id="outlined-basic"
          label="Title"
          variant="outlined"
        />
        <Typography variant="subtitle1">{errors.title?.message}</Typography>

        <Typography variant="h6" sx={{ marginY: "20px" }}>
          Questions
        </Typography>
        {fields.map((item, index) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            marginBottom="10px"
            flexDirection="column"
          >
            <div>
              <StyledTextField
                {...register(`questions[${index}].answer`, {
                  valueAsNumber: true,
                  validate: (value) =>
                    (value >= 1 && value <= 4) ||
                    "Answer must be between 1 and 4",
                })}
                label={`Answer ${index + 1}`}
                variant="outlined"
                type="number"
              />

              <IconButton
                onClick={() => remove(index)}
                color="secondary"
                aria-label="remove question"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </div>

            {errors.questions?.[index]?.answer && (
              <Typography
                variant="subtitle2"
                color="error"
                sx={{ marginLeft: 1 }}
              >
                {errors.questions[index].answer.message}
              </Typography>
            )}
          </Box>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={() => append({ answer: "" })}
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            width: "10px",
            // bgcolor: "green",
            // background: "linear-gradient(120deg,rgb(188, 24, 221) 30%,rgb(10, 75, 92) 90%)",
            bgcolor: "rgb(188, 24, 221)",
            marginTop: "30px",
            height: "30px",
          }}
        >
          add
        </Button>

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
