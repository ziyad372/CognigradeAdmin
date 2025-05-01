import React, { useState, useEffect, useRef } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import { axiosPrivate } from "../api/axios";
import "./GenerateOMR_1.css";

export default function GeneratingOMR_1() {
  const [data, setData] = useState("");
  const [value, setValue] = useState(null);
  const [omrs, setOMRs] = useState([]);
  const [students, setStudents] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchOMRs = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axiosPrivate.get("/api/v1/omr/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOMRs(response.data.results);
      } catch (error) {
        console.error("Failed to fetch OMRs:", error);
      }
    };
    fetchOMRs();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const handleChange = async (event) => {
    const omrId = event.target.value;
    setData(omrId);
    const selectedOMR = omrs.find((omr) => omr.id === omrId);
    setValue(selectedOMR);

    console.log(selectedOMR.classroom);

    const accessToken = localStorage.getItem("accessToken");
    try {
      const classroomResponse = await axiosPrivate.get(
        `/api/v1/classrooms/${selectedOMR.classroom}/`,

        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setStudents(classroomResponse.data.enrollments);
    } catch (err) {
      console.error("Failed to fetch classroom data:", err);
    }
  };

  return (
    <div id="print">
      <Button onClick={handlePrint} data-html2canvas-ignore>
        Print
      </Button>
      <Select onChange={handleChange} value={data} displayEmpty>
        <MenuItem value="" disabled>
          Select OMR
        </MenuItem>
        {omrs.map((classroom) => (
          <MenuItem key={classroom.id} value={classroom.id}>
            {classroom.title || classroom.id}
          </MenuItem>
        ))}
      </Select>

      <div ref={contentRef}>
        {students.map((student) => (
          <div
            key={student.id}
            className="main"
            style={{ pageBreakAfter: "always" }}
          >
            <div className="upperBox">
              <div className="headerRow">
                <div className="qrBox">
                  <QRCode
                    size={256}
                    style={{
                      height: "auto",
                      maxWidth: "100px",
                      width: "100px",
                    }}
                    value={JSON.stringify({
                      student_id: student.id,
                      name: student.first_name,
                      roll: student.id,
                      omr_id: value?.id,
                      classroom: value?.classroom,
                    })}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <div className="studentDetails">
                  <p>
                    <strong>Student Name:</strong> {student.first_name}
                  </p>
                  <p>
                    <strong>Roll Number:</strong> {student.id}
                  </p>
                  <p>
                    <strong>Sheet Code:</strong> {value?.id || "N/A"}
                  </p>
                </div>
                <div className="methodBox">
                  <div className="methodBlock">
                    <p className="methodTitle">Correct Method</p>
                    <div className="bubbleRow">
                      <div className="bubble">A</div>
                      <div className="bubble">B</div>
                      <div className="bubble filled"></div>
                      <div className="bubble">D</div>
                    </div>
                  </div>

                  <div className="methodBlock">
                    <p className="methodTitle">Wrong Methods</p>
                    <div className="bubbleRow">
                      <div className="bubble halfFilled"></div>
                      <div className="bubble dotCenter"></div>
                      <div className="bubble checkMark">✓</div>
                      <div className="bubble crossMark">✖</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="instructions">
                <strong>Instructions:</strong>
                <ol>
                  <li>Avoid any stray marks on the Answer Sheet.</li>
                  <li>
                    Darken or fill the circle completely using a black or blue
                    pen.
                  </li>
                 
                </ol>
              </div>
            </div>

            <div className="boxOMR">
              {[...Array(3)].map((_, colIdx) => (
                <div key={colIdx} className="s_column">
                  {[...Array(10)].map((_, rowIdx) => {
                    const qNum = colIdx * 10 + rowIdx + 1;
                    return (
                      <div
                        key={qNum}
                        className={qNum % 10 === 0 ? "question1" : "question"}
                      >
                        <div
                          className={qNum % 10 === 0 ? "q_number1" : "q_number"}
                        >
                          {qNum}.
                        </div>
                        {["A", "B", "C", "D"].map((opt) => (
                          <div key={opt} className="button">
                            {opt}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="footer">
              <div className="f_box">
                <div className="title">
                  <p>Candidate Signature</p>
                </div>
                <div className="sign"></div>
              </div>
              <div className="f_box">
                <div className="title">
                  <p>Invigilator Signature</p>
                </div>
                <div className="sign"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
