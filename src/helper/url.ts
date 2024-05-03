import axios from "axios";

export const app_api = import.meta.env.VITE_APP_API;

export const fetcher = (url: string) =>
  axios
    .get(
      url,
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    )
    .then((res) => res.data);
