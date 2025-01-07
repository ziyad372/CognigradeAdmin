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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  
  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/users/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(response);
        setUsers(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const filteredUsers = roleFilter
    ? users.filter((user) => user.role === roleFilter)
    : users;

  const handleFetchUserDetails = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axiosPrivate.get(`/api/v1/users/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedUser(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setUserToEdit({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUserToEdit((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.patch(`/api/v1/users/${userToEdit.id}/`, userToEdit, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(
        users.map((user) => (user.id === userToEdit.id ? userToEdit : user))
      );
      setEditDialogOpen(false);
      console.log(`User with ID ${userToEdit.id} updated successfully`);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axiosPrivate.delete(`/api/v1/users/${selectedUser.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      console.log(`User with ID ${selectedUser.id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };



  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/addUser");
  };
  return (
    <Container>
      <FormControl fullWidth margin="normal" variant="outlined">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
          onClick={handleAddUser}
        >
          Add User
        </Button>
        <InputLabel>Filter by role</InputLabel>
        <Select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          label="Filter by role"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
        </Select>
      </FormControl>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                sx={{
                  width: "1000px",
                  height: "60px",
                  bgcolor: "white",
                  borderRadius: "10px",
                }}
                key={user.id}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name || "N/A"}</TableCell>
                <TableCell>{user.last_name || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleFetchUserDetails(user.id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedUser && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <Typography>ID: {selectedUser.id}</Typography>
            <Typography>
              First Name: {selectedUser.first_name || "N/A"}
            </Typography>
            <Typography>
              Last Name: {selectedUser.last_name || "N/A"}
            </Typography>
            <Typography>Email: {selectedUser.email}</Typography>
            <Typography>Role: {selectedUser.role}</Typography>
            <Typography>
              Active: {selectedUser.is_active ? "Yes" : "No"}
            </Typography>
            <Button variant="contained" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {userToEdit && (
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              name="first_name"
              label="First Name"
              value={userToEdit.first_name || ""}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={userToEdit.last_name || ""}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={userToEdit.email || ""}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="role"
              label="Role"
              value={userToEdit.role || ""}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="is_active"
              label="Active"
              value={userToEdit.is_active ? "Yes" : "No"}
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
      {selectedUser && (
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user {selectedUser.email}?
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

export default UserList;
