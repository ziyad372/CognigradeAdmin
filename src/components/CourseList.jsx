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
import AddIcon from '@mui/icons-material/Add';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState({});
  
  useEffect(() => {
    const fetchCourses = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/courses/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        setCourses(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFetchCourseDetails = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axiosPrivate.get(`/api/v1/courses/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedCourse(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCourseToEdit({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCourseToEdit((prevCourse) => ({ ...prevCourse, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.patch(`/api/v1/courses/${courseToEdit.id}/`, courseToEdit, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCourses(
        courses.map((course) => (course.id === courseToEdit.id ? courseToEdit : course))
      );
      setEditDialogOpen(false);
      console.log(`Course with ID ${courseToEdit.id} updated successfully`);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleDeleteSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.delete(`/api/v1/courses/${selectedCourse.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      setDeleteDialogOpen(false);
      console.log(`Course with ID ${selectedCourse.id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };



  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate("/addCourse");
  };

  return (
    <Container>
      <FormControl fullWidth margin="normal" variant="outlined">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
          onClick={handleAddCourse}
        >
          Add Course
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
              <TableCell>Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                sx={{
                  width: "1000px",
                  height: "60px",
                  bgcolor: "white",
                  borderRadius: "10px",
                }}
                key={course.id}
              >
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleFetchCourseDetails(course.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditCourse(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCourse(course)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedCourse && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Course Details</DialogTitle>
          <DialogContent>
            <Typography>ID: {selectedCourse.id}</Typography>
            <Typography>Name: {selectedCourse.name}</Typography>
            <Typography>Code: {selectedCourse.code}</Typography>
            <Button variant="contained" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {courseToEdit && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              label="Name"
              value={courseToEdit.name}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="code"
              label="Code"
              value={courseToEdit.code}
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
      {selectedCourse && (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete course {selectedCourse.name}?
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

export default CourseList;
