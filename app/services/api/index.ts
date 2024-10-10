import axios from "axios";

const base_url = "https://flame-api.horizonsparkle.com/api"

export const axiosClient = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    timeout: 5000,
    
});

