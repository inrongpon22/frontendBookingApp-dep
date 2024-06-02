import axios, { InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const _axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API,
});

const onRequest = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
        config.headers.Authorization = `${token}`;
        config.headers["Content-Type"] = "application/json";
    }
    return config;
};

_axiosInstance.interceptors.request.use(onRequest);

_axiosInstance.interceptors.response.use(
    (response) => {
        // Return a successful response back to the calling service
        return response;
    },
    (error) => {
        // Handle error from calling service
        const navigate = useNavigate();
        if (error.response === undefined) {
            // setTimeout(() => {
            // 	history.push("/error500");
            // 	location.reload();
            // });
        } else if (error.response.status === 400) {
            setTimeout(() => {
                toast.error("400 Bad Request");
            });
        } else if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("UserInfo");
            setTimeout(() => {
                navigate("/login");
                location.reload();
            });
        } else if (error.response.status === 403) {
            setTimeout(() => {
                toast.error("403 Forbidden");
            });
        } else if (error.response.status === 404) {
            setTimeout(() => {
                toast.error("404 Not Found");
            });
        } else if (error.response.status === 500) {
            setTimeout(() => {
                toast.error("500 Internal Server Error");
            });
        } else if (error.response.status === 503) {
            setTimeout(() => {
                toast.error("503 Service Unavailable");
            });
        }

        return new Promise((reject) => {
            reject(error);
        });
    }
);
export const axiosInstance = _axiosInstance;
