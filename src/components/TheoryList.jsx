import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  FormControl,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios, { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";

const TheoryList = () => {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheory, setSelectedTheory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [theoryToEdit, setTheoryToEdit] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [studentMap, setStudentMap] = useState({});
  const [evaluatedTheoryIds, setEvaluatedTheoryIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheories = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/theory/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setTheories(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch theories:", error);
        setLoading(false);
      }
    };

    fetchTheories();
  }, []);

  const handleFetchTheoryDetails = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axiosPrivate.get(`/api/v1/theory/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedTheory(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch theory details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTheory(null);
  };

  const handleEditTheory = (theory) => {
    setTheoryToEdit(theory);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setTheoryToEdit({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTheoryToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.patch(
        `/api/v1/theory/${theoryToEdit.id}/`,
        theoryToEdit,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTheories(
        theories.map((theory) =>
          theory.id === theoryToEdit.id ? theoryToEdit : theory
        )
      );
      setEditDialogOpen(false);
      console.log(`Theory with ID ${theoryToEdit.id} updated successfully`);
    } catch (error) {
      console.error("Failed to update theory:", error);
    }
  };

  const handleDeleteTheory = (theory) => {
    setSelectedTheory(theory);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedTheory(null);
  };

  const handleDeleteSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.delete(`/api/v1/theory/${selectedTheory.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTheories(theories.filter((theory) => theory.id !== selectedTheory.id));
      setDeleteDialogOpen(false);
      console.log(`Theory with ID ${selectedTheory.id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete theory:", error);
    }
  };

  const handleAddTheory = () => {
    navigate("/createTheory");
  };

  //  const handleEvaluateTheory = async (id) => {
  //          try {
  //            await axios.post(`/api/v1/theory/${id}/evaluate/`, theories.map((i) => {i == id}), {
  //              headers: { Authorization: `Bearer ${token}` },
  //            });
  //            alert("Theory submitted!");
  //          } catch (error) {
  //            alert("Submission failed");
  //            console.error(error);
  //          } finally {
  //            navigate(`/theory/${id}/result`);
  //          }
  //        };

  const handleEvaluateTheory = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    const theory = theories.find((t) => t.id === id);
    if (!theory) {
      alert("Theory not found.");
      return;
    }

    try {
      const evaluateResponse = await axios.post(
        `/api/v1/theory/${id}/evaluate/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const submissions = evaluateResponse.data.submissions;

      const studentIds = [...new Set(submissions.map((s) => s.student))];
      const studentMapTemp = {};

      for (let studentId of studentIds) {
        try {
          const res = await axiosPrivate.get(`/api/v1/users/${studentId}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          studentMapTemp[studentId] = res.data.first_name;
        } catch (err) {
          studentMapTemp[studentId] = `Student data not found`;
        }
      }

      setStudentMap(studentMapTemp);
      setEvaluationResult(evaluateResponse.data);
      setEvaluationDialogOpen(true);
      setEvaluatedTheoryIds((prev) => [...new Set([...prev, id])]);
    } catch (error) {
      console.error("Error evaluating theory:", error);
      alert("Evaluation failed.");
    }
  };

  return (
    <Container>
      <FormControl fullWidth margin="normal" variant="outlined">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddTheory}
          sx={{
            bgcolor: "green",
            background: "linear-gradient(120deg, #bc18dd 30%, #a4dae7 90%)",
            marginBottom: "30px",
          }}
        >
          Add Theory
        </Button>
      </FormControl>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Classroom</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theories.map((theory) => (
              <TableRow
                sx={{
                  height: "60px",
                  bgcolor: "white",
                  borderRadius: "10px",
                }}
                key={theory.id}
              >
                <TableCell>{theory.id}</TableCell>
                <TableCell>{theory.title}</TableCell>
                <TableCell>{theory.classroom}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleFetchTheoryDetails(theory.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditTheory(theory)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTheory(theory)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEvaluateTheory(theory.id)}
                    sx={{ ml: 1 }}
                  >
                    {evaluatedTheoryIds.includes(theory.id)
                      ? "View Evaluation Result"
                      : "Evaluate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedTheory && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Theory Details</DialogTitle>
          <DialogContent>
            <Typography>ID: {selectedTheory.id}</Typography>
            <Typography>Title: {selectedTheory.title}</Typography>
            <Typography>Classroom ID: {selectedTheory.classroom}</Typography>
            <Typography>Questions:</Typography>
            {selectedTheory.questions.map((q, index) => (
              <Typography key={index}>
                Q: {q.question} | A: {q.answer}
              </Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {theoryToEdit && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Theory</DialogTitle>
          <DialogContent>
            <TextField
              name="title"
              label="Title"
              value={theoryToEdit.title}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="classroom"
              label="Classroom ID"
              value={theoryToEdit.classroom}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            {/* Not editing questions here */}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {selectedTheory && (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete Theory "{selectedTheory.title}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={evaluationDialogOpen}
        onClose={() => setEvaluationDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Evaluation Results</DialogTitle>
        <DialogContent dividers>
          {evaluationResult?.submissions?.map((submission) => (
            <div key={submission.id} style={{ marginBottom: "20px" }}>
              <Typography variant="h6">
                {studentMap[submission.student] ||
                  `Student ${submission.student}`}{" "}
                - Score: {submission.score -1}
              </Typography>
              {submission.answers.map((ans) => (
                <Typography key={ans.id} variant="body2" sx={{ pl: 2 }}>
                  <strong>Ans: </strong> {ans.answer} — <strong>Marks:</strong>{" "}
                  {ans.marks}
                </Typography>
              ))}
              <hr style={{ margin: "10px 0" }} />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEvaluationDialogOpen(false)}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TheoryList;
