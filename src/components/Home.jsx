import React from "react";
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";

export default function Home() {
  useEffect(() => {
    const ins = async () => {
      const accessToken = localStorage.getItem("accessToken");

      const response = axiosPrivate
        .get("/api/v1/users/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          console.log(response);
          localStorage.setItem("institution", response.data.institution);
          localStorage.setItem("role", response.data.role);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    ins();
  }, []);

  return <div>Home</div>;
}
