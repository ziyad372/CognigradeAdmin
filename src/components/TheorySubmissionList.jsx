import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { axiosPrivate } from "../api/axios";

export default function TheorySubmissionsList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async (id, type) => {
    const endpoint =
      type === "student"
        ? `/api/v1/users/${id}/`
        : `/api/v1/theory/${id}/`;
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axiosPrivate.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch ${type} data`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/submissions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const rawSubs = response.data.results || response.data;

        const detailedSubs = await Promise.all(
          rawSubs.map(async (submission) => {
            const [studentData, theoryData] = await Promise.all([
              fetchDetails(submission.student, "student"),
              fetchDetails(submission.theory, "theory"),
            ]);

            return {
              ...submission,
              student: studentData,
              theory: theoryData,
            };
          })
        );

        setSubmissions(detailedSubs);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Theory Submissions
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : submissions.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        submissions.map((submission) => {
          const studentName = submission.student
            ? `${submission.student.first_name} ${
                submission.student.last_name || ""
              }`
            : "Unknown";

          return (
            <Card key={submission.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Theory: {submission.theory?.title || "Untitled"}
                </Typography>
                <Typography variant="subtitle1">
                  Student: {studentName}
                </Typography>
                <Typography variant="subtitle2" color="success.main">
                  Score: {submission.score ?? "Not graded"}
                </Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}
