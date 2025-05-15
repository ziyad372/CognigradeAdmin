import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    classrooms: 0,
    omrs: 0,
    theories: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
  
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const [users, courses, classrooms, omrs, theories] = await Promise.all([
          axiosPrivate.get("/api/v1/users/", headers),
          axiosPrivate.get("/api/v1/courses/", headers),
          axiosPrivate.get("/api/v1/classrooms/", headers),
          axiosPrivate.get("/api/v1/omr/", headers),
          axiosPrivate.get("/api/v1/theory/", headers),
        ]);
  
        setStats({
          users: users.data.results.length,
          courses: courses.data.results.length,
          classrooms: classrooms.data.results.length,
          omrs: omrs.data.results.length,
          theories: theories.data.results.length,
          theories: theories.data.results.length,
        });
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <Box p={4} width="100%">
      <Typography variant="h4" gutterBottom>
        Welcome, Admin
      </Typography>

      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Here's a quick overview of the system.
      </Typography>

      <Grid container spacing={3}>
        {[
          { label: "Total Users", count: stats.users },
          { label: "Courses", count: stats.courses },
          { label: "Classrooms", count: stats.classrooms },
          { label: "OMRs", count: stats.omrs },
          { label: "Theory", count: stats.theories }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4" color="primary">
                  {item.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminHome;
