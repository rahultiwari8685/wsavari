import axios from "axios";

const api = axios.create({
  baseURL: "https://api.ayvaus.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
