import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Box,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios, { axiosPrivate } from "../api/axios";
import { useState, useEffect } from "react";

const schema = yup.object({
  classroom: yup.number().required("Classroom ID is required"),
  title: yup.string().required("Title is required"),
  type: yup.string().required("Type is required"),
  questions: yup.array().of(
    yup.object({
      question: yup.string().required("Question is required"),
      answer: yup.string().required("Answer is required"),
    })
  ).required("Questions are required"),
}).required();

export default function CreateTheory() {
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
    defaultValues: {
      questions: [{ question: "", answer: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axiosPrivate.get("/api/v1/classrooms/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setClassrooms(response.data.results);
      } catch (error) {
        console.error("Failed to fetch classrooms:", error);
      }
    };

    fetchClassrooms();
  }, []);

  const onSubmit = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post("/api/v1/theory/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Theory exam created successfully:", response.data);
      setSnackbarMessage("Theory exam created successfully");
      setOpenSnackbar(true);
      reset({ classroom: "", title: "", type: "", questions: [{ question: "", answer: "" }] });
    } catch (error) {
      console.error("Error creating theory exam:", error);
      setSnackbarMessage("Failed to create theory exam");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ textAlign: "center", marginY: "30px" }}>
        Create Theory Exam
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <Select
          {...register("classroom")}
          sx={{ width: "300px", marginBottom: "10px" }}
          defaultValue=""
        >
          <MenuItem value=""><em>Select Classroom</em></MenuItem>
          {classrooms.map((classroom) => (
            <MenuItem key={classroom.id} value={classroom.id}>
              {classroom.id} - {classroom.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          {...register("title")}
          label="Exam Title"
          variant="outlined"
          sx={{ width: "300px", marginBottom: "10px" }}
        />
        {errors.title && <Typography color="error">{errors.title.message}</Typography>}

        <Select
          {...register("type")}
          sx={{ width: "300px", marginBottom: "20px" }}
          defaultValue=""
        >
          <MenuItem value=""><em>Select Type</em></MenuItem>
          <MenuItem value="exam">Exam</MenuItem>
          <MenuItem value="quiz">Quiz</MenuItem>
          <MenuItem value="assignment">Assignment</MenuItem>
        </Select>
        {errors.type && <Typography color="error">{errors.type.message}</Typography>}

        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Questions
        </Typography>

        {fields.map((item, index) => (
          <Box key={item.id} sx={{ marginBottom: "20px", width: "100%", maxWidth: "600px" }}>
            <TextField
              {...register(`questions[${index}].question`)}
              label={`Question ${index + 1}`}
              fullWidth
              multiline
              rows={2}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              {...register(`questions[${index}].answer`)}
              label={`Answer ${index + 1}`}
              fullWidth
              multiline
              rows={3}
              sx={{ marginBottom: "10px" }}
            />
            <IconButton onClick={() => remove(index)} color="error">
              <RemoveCircleOutlineIcon />
            </IconButton>

            {errors.questions?.[index]?.question && (
              <Typography color="error">{errors.questions[index].question.message}</Typography>
            )}
            {errors.questions?.[index]?.answer && (
              <Typography color="error">{errors.questions[index].answer.message}</Typography>
            )}
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={() => append({ question: "", answer: "" })}
          startIcon={<AddCircleOutlineIcon />}
          sx={{ marginBottom: "20px" }}
        >
          Add Question
        </Button>

        <Button
          variant="contained"
          color="success"
          type="submit"
        >
          Submit Theory Exam
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
