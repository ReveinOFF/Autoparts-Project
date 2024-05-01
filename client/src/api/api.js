import axios from "axios";

const href = process.env.REACT_APP_HOST + "/api";

export const api = axios
  .create({
    baseURL: href,
  })
  .interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
