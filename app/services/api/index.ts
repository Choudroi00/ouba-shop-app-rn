import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from "../../utils/helpers";


const base_url = "https://fame.ayoub-dev.xyz/api"


const axiosClient = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    timeout: 5000,
    
});

axiosClient.interceptors.request.use(
  async (config) => {
      const token = await getData('user');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
  (response) => {
    //console.log("Response:", response);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Error Request:", error.request);
    } else {
      // Something else caused the error
      console.error("Error Message:", error.message);
    }
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export const HOST = "api-fame.ayoub-dev.xyz";


const axiosClientV2 = axios.create({
  baseURL: "https://api-fame.ayoub-dev.xyz/api/v2",

  timeout: 5000,
  headers: {
    "Cache-Control": "no-cache",
    'Pragma': "no-cache",
    'Expires': "0",
  },
});

axiosClientV2.interceptors.request.use(
  async (config) => {
      const token = await getData('user');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export {axiosClient, axiosClientV2};

