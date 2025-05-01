import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { axiosPrivate } from "../api/axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function SubmitTheory() {
  const { theoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const omr = await axiosPrivate.get(`/api/v1/theory/${theoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQuestions(omr.data?.questions || []);
      } catch (error) {
        console.error("Error fetching theory questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [theoryId]);

  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      theory: parseInt(theoryId),
    //   student: parseInt(studentId),
      answers: questions.map((q) => ({
        question: q.id,
        answer: answers[q.id] || "",
      })),
    };

     

    try {
      await axios.post("/api/v1/submissions/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Theory submitted!");
    } catch (error) {
      alert("Submission failed");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading theory questions...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" p={4}>
      <Typography variant="h4" gutterBottom>
        Submit Theory
      </Typography>

      {questions.map((q, idx) => (
        <Card key={q.id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Question {idx + 1}: {q.question}
            </Typography>

            <TextField
              multiline
              fullWidth
              minRows={4}
              placeholder="Write your answer..."
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              variant="outlined"
            />
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
