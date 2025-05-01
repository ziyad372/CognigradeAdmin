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
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const OMRList = () => {
  const [omrs, setOMRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOMR, setSelectedOMR] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [omrToEdit, setOMRToEdit] = useState({});

  useEffect(() => {
    const fetchOMRs = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/omr/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        setOMRs(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch OMRs:", error);
        setLoading(false);
      }
    };

    fetchOMRs();
  }, []);

  const handleFetchOMRDetails = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axiosPrivate.get(`/api/v1/omr/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedOMR(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch OMR details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOMR(null);
  };

  const handleEditOMR = (omr) => {
    setOMRToEdit(omr);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setOMRToEdit({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setOMRToEdit((prevOMR) => ({ ...prevOMR, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.patch(`/api/v1/omr/${omrToEdit.id}/`, omrToEdit, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOMRs(
        omrs.map((omr) => (omr.id === omrToEdit.id ? omrToEdit : omr))
      );
      setEditDialogOpen(false);
      console.log(`OMR with ID ${omrToEdit.id} updated successfully`);
    } catch (error) {
      console.error("Failed to update OMR:", error);
    }
  };

  const handleDeleteOMR = (omr) => {
    setSelectedOMR(omr);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedOMR(null);
  };

  const handleDeleteSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.delete(`/api/v1/omr/${selectedOMR.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOMRs(omrs.filter((omr) => omr.id !== selectedOMR.id));
      setDeleteDialogOpen(false);
      console.log(`OMR with ID ${selectedOMR.id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete OMR:", error);
    }
  };

  const navigate = useNavigate();

  const handleAddOMR = () => {
    navigate("/createOMR");
  };

  return (
    <Container>
      <FormControl fullWidth margin="normal" variant="outlined">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddOMR}
          sx={{
            // width: "150px",
            bgcolor: "green",
            background:
              "linear-gradient(120deg,  #bc18dd 30%, #a4dae7 90%)",
              marginBottom: "100px",
          }}
        >
          Add OMR
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
            {omrs.map((omr) => (
              <TableRow
                sx={{
                  width: "1000px",
                  height: "60px",
                  bgcolor: "white",
                  borderRadius: "10px",
                }}
                key={omr.id}
              >
                <TableCell>{omr.id}</TableCell>
                <TableCell>{omr.title}</TableCell>
                <TableCell>{omr.classroom}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleFetchOMRDetails(omr.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditOMR(omr)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOMR(omr)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedOMR && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>OMR Details</DialogTitle>
          <DialogContent>
            <Typography>ID: {selectedOMR.id}</Typography>
            <Typography>Title: {selectedOMR.title}</Typography>
            <Typography>Classroom ID: {selectedOMR.classroom}</Typography>
            <Typography>Questions: {selectedOMR.questions.map(q => q.answer).join(', ')}</Typography>
            <Button variant="contained" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {omrToEdit && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit OMR</DialogTitle>
          <DialogContent>
            <TextField
              name="title"
              label="Title"
              value={omrToEdit.title}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="classroom"
              label="Classroom ID"
              value={omrToEdit.classroom}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="questions"
              label="Questions"
            //   value={omrToEdit.questions.map(q => q.answer).join(', ')}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
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
      {selectedOMR && (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete OMR {selectedOMR.title}?
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
    </Container>
  );
};

export default OMRList;
