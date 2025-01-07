import React, { useState, useEffect } from "react";
import {
  Container,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  IconButton,
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
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classroomToEdit, setClassroomToEdit] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

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

    const fetchTeachers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/users/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const filteredTeachers = "teacher"
          ? response.data.results.filter((user) => user.role === "teacher")
          : response.data.results;

        console.log("Filtered users: ", filteredTeachers);
        setTeachers(filteredTeachers);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };

    const fetchCourses = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/courses/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCourses(response.data.results);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchClassrooms();
    fetchTeachers();
    fetchCourses();
  }, []);

  const handleFetchClassroomDetails = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axiosPrivate.get(`/api/v1/classrooms/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedClassroom(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch classroom details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedClassroom(null);
  };

  const handleEditClassroom = (classroom) => {
    setClassroomToEdit(classroom);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setClassroomToEdit({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setClassroomToEdit((prevClassroom) => ({
      ...prevClassroom,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.patch(
        `/api/v1/classrooms/${classroomToEdit.id}/`,
        classroomToEdit,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setClassrooms(
        classrooms.map((classroom) =>
          classroom.id === classroomToEdit.id ? classroomToEdit : classroom
        )
      );
      setEditDialogOpen(false);
      console.log(
        `Classroom with ID ${classroomToEdit.id} updated successfully`
      );
    } catch (error) {
      console.error("Failed to update classroom:", error);
    }
  };

  const handleDeleteClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedClassroom(null);
  };

  const handleDeleteSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.delete(`/api/v1/classrooms/${selectedClassroom.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setClassrooms(
        classrooms.filter((classroom) => classroom.id !== selectedClassroom.id)
      );
      setDeleteDialogOpen(false);
      console.log(
        `Classroom with ID ${selectedClassroom.id} deleted successfully`
      );
    } catch (error) {
      console.error("Failed to delete classroom:", error);
    }
  };

  const navigate = useNavigate();

  const handleAddClassroom = () => {
    navigate("/addClassroom");
  };

  return (
    <Container>
      <FormControl fullWidth margin="normal" variant="outlined">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClassroom}
        >
          Add Classroom
        </Button>
      </FormControl>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms.map((classroom) => (
              <TableRow
                sx={{
                  width: "1000px",
                  height: "60px",
                  bgcolor: "white",
                  borderRadius: "10px",
                }}
                key={classroom.id}
              >
                <TableCell>{classroom.id}</TableCell>
                <TableCell>{classroom.name}</TableCell>
                <TableCell>{classroom.teacher_id}</TableCell>
                <TableCell>{classroom.course_id}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleFetchClassroomDetails(classroom.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditClassroom(classroom)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClassroom(classroom)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedClassroom && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Classroom Details</DialogTitle>
          <DialogContent>
            <Typography>ID: {selectedClassroom.id}</Typography>
            <Typography>Name: {selectedClassroom.name}</Typography>
            <Typography>Teacher ID: {selectedClassroom.teacher_id}</Typography>
            <Typography>Course ID: {selectedClassroom.course_id}</Typography>
            <Button variant="contained" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {classroomToEdit && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Classroom</DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              value={classroomToEdit.name}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="teacher_id"
              label="Teacher ID"
              value={classroomToEdit.teacher_id}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="course_id"
              label="Course ID"
              value={classroomToEdit.course_id}
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
      {selectedClassroom && (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete classroom {selectedClassroom.name}
              ?
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

export default ClassroomList;
