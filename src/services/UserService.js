import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "https://e-commerce-website-server-mu.vercel.app",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});
