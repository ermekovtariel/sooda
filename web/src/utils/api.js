import axios from "axios";

const API = axios.create({});

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        config.headers["Authorization"] = `Bearer_${user.token}`;
    }
    config.headers["Content-Type"] = "application/json";
    config.headers['User-agent'] = 'learning app';
    return config;
});



export default API;
