import React, { useEffect, useState } from 'react';
import axios, { axiosPrivate } from "../api/axios";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';

export default function SubmitTheoryList() {
  const [theories, setTheories] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    async function fetchTheories() {
      try {
        const response = await axios.get('/api/v1/theory/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTheories(response.data.results || []);
      } catch (error) {
        console.error('Error fetching theories:', error);
      }
    }

    fetchTheories();
  }, []);

  return (
    <Box maxWidth="1000px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" color="primary">
        Select a Theory to Start
      </Typography>

      <Grid container spacing={3}>
        {theories.map(theory => (
          <Grid item xs={12} sm={6} md={4} key={theory.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => navigate(`/SubmitTheory/${theory.id}`)}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {theory.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {theory.type}
                  </Typography>
                  {theory.description && (
                    <Typography variant="body2" mt={1}>
                      {theory.description.length > 100
                        ? theory.description.slice(0, 100) + '...'
                        : theory.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
