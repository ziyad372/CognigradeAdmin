import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { Box, Button, Card, MenuItem, Select, Typography } from "@mui/material";
import "./GeneratingOMR.css";
import { useReactToPrint } from "react-to-print";
import { ReactToPrint } from "react-to-print";
import { useRef } from "react";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";

import qr from "../assets/frame.png";
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";

export default function GeneratingOMR() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);
  const [omrs, setOMRs] = useState([]);

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchOMRs = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosPrivate.get("/api/v1/omr/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log(response);
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

  // const handlePrint1 = async ()=>{

  //     const element = ref.current;

  //     const canvas = await html2pdf(element);
  //     const data  = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF({
  //         orientation: "portrait",
  //         unit: "px",
  //         format: "a4",
  //     });
  //     pdf.addImage(data, 'PNG', 0,0,100,100);
  //     pdf.save('eee.pdf');
  // }

  const handleChange = (event) => {
    setData(event.target.value);
    const val = omrs.find((omr) => omr.id === data);
    console.log(val);
    setValue(val);
  };

  return (
    <div id="print">
      <Button onClick={handlePrint} data-html2canvas-ignore>
        print
      </Button>
      <Select onChange={handleChange} value={data}>
        {omrs.map((classroom) => (
          <MenuItem key={classroom.id} value={classroom.id}>
            {classroom.id}
          </MenuItem>
        ))}
      </Select>
      <div ref={contentRef} className="main">
        <div className="upperBox">
          <div className="rightSide">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100px", width: "100px" }}
              value={value}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div className="leftside"></div>
        </div>
        <div className="boxOMR">
          <div className="s_column">
            <div className="question">
              <div className="q_number">1.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">2.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">3.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">4.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">5.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">6.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">7.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">8.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">9.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question1">
              <div className="q_number1">10.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
          </div>
          <div className="s_column">
            <div className="question">
              <div className="q_number">11.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">12.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">13.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">14.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">15.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">16.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">17.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">18.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">19.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question1">
              <div className="q_number1">20.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
          </div>
          <div className="s_column">
            <div className="question">
              <div className="q_number">21.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">22.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">23.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">24.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">25.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">26.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">27.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">28.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question">
              <div className="q_number">29.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
            <div className="question1">
              <div className="q_number1">30.</div>
              <div className="button">A</div>
              <div className="button">B</div>
              <div className="button">C</div>
              <div className="button">D</div>
            </div>
          </div>
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
    </div>
  );
}
