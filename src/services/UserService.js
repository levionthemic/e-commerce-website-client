import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});
