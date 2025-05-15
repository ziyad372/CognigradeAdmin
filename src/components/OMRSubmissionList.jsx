import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { axiosPrivate } from "../api/axios";

const OMRSubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentMap, setStudentMap] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchOMRSubmissions = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axiosPrivate.get("/api/v1/omr-submission/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setSubmissions(response.data.results);
        console.log(response)
        const studentIds = [...new Set(response.data.results.map((s) => s.id))];
        const studentMapTemp = {};

        // for (const studentId of studentIds) {
        //   try {
        //     const studentRes = await axiosPrivate.get(`/api/v1/omr/${studentId}/`, {
        //       headers: { Authorization: `Bearer ${accessToken}` },
        //     });
        //     studentMapTemp[studentId] = studentRes.data.results.first_name;
        //     console.log(studentRes.data.results.first_name);
        //   } catch {
        //     studentMapTemp[studentId] = `Student ${studentId}`;
        //   }
        // }

        // setStudentMap(studentMapTemp);
      } catch (error) {
        console.error("Error fetching OMR submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOMRSubmissions();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        OMR Submissions
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Submitted On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.user}</TableCell>
                <TableCell>{submission.score}</TableCell>
                <TableCell>
                  {new Date(submission.created_on).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* View Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>OMR Submission Detail</DialogTitle>
        <DialogContent dividers>
          {selectedSubmission &&
            selectedSubmission.answers?.map((answer, idx) => (
              <Typography key={idx}>
                <strong>Q:</strong> {answer.question_text} <br />
                <strong>Answer:</strong> {answer.answer} — <strong>Marks:</strong>{" "}
                {answer.marks}
                <hr />
              </Typography>
            ))}
          {!selectedSubmission?.answers?.length && (
            <Typography>No detailed answers available.</Typography>
          )}
        </DialogContent>
        <Button onClick={() => setSelectedSubmission(null)} variant="contained">
          Close
        </Button>
      </Dialog>
    </Container>
  );
};

export default OMRSubmissionList;
