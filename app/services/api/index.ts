import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from "../../utils/helpers";


const base_url = "https://fame.ayoub-dev.xyz/api"
export const HOST = "https://fame.ayoub-dev.xyz/"

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

export {axiosClient}

