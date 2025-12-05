import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,  // Ensures cookies are sent with requests
});

export default api;
