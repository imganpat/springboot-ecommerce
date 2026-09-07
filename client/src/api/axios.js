import axios from "axios";

import { envConfig } from "@/config/env";
import { getToken } from "@/utils/auth";

const axiosInstance = axios.create({
    baseURL: envConfig.apiBaseUrl,

    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;