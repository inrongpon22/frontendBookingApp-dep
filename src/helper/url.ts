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
