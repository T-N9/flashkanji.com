import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://flash-kanji-node.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
