import axios from "axios";
import { useLocation } from "react-router-dom";

export const app_api = import.meta.env.VITE_APP_API;

export const fetcher = (url: string) =>
    axios
        .get(url, {
            headers: {
                authorization: localStorage.getItem("token"),
            },
        })
        .then((res) => res.data);

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const getGoogleMapUrl = (address: string) => {
    const body = {
        address: address,
    };
    axios
        .post(`${app_api}/googleMap`, body)
        .then((res) => {
            window.open(res.data.googleMapLink, "_blank");
        })
        .catch((err) => console.log(err));
};
