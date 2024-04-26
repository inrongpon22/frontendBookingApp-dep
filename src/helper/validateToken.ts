// import axios, { InternalAxiosRequestConfig } from "axios";


// const onRequest = (
// 	config: InternalAxiosRequestConfig
// ): InternalAxiosRequestConfig => {
// 	const token = localStorage.getItem("MCToken");
// 	if (token && token !== "") {
// 		config.headers.Authorization = `Bearer ${token}`;
// 		config.headers["Content-Type"] = "application/json";
// 	}
// 	return config;
// };

// interceptors.request.use(onRequest);

// interceptors.response.use(
// 	(response) => {
// 		// Return a successful response back to the calling service
// 		return response;
// 	},
// 	(error) => {
// 		// Handle error from calling service
// 		if (error.response === undefined) {
// 			// setTimeout(() => {
// 			// 	history.push("/error500");
// 			// 	location.reload();
// 			// });
// 		} else if (error.response.status === 400) {
// 			setTimeout(() => {
// 				PopupAlert("Bad Request: Invalid request syntax", "error");
// 			});
// 		} else if (error.response.status === 401) {
// 			localStorage.removeItem("token");
// 			localStorage.removeItem("UserInfo");
// 			setTimeout(() => {
// 				history.push("/login");
// 				location.reload();
// 			});
// 		} else if (error.response.status === 403) {
// 			setTimeout(() => {
// 				PopupAlert("403 Forbidden!", "error");
// 			});
// 		} else if (error.response.status === 404) {
// 			setTimeout(() => {
// 				PopupAlert("404 Not Found", "error");
// 			});
// 		} else if (error.response.status === 500) {
// 			// setTimeout(() => {
// 			// 	history.push("/error500");
// 			// 	location.reload();
// 			// });
// 		} else if (error.response.status === 503) {
// 			setTimeout(() => {
// 				PopupAlert("503 Service Unavailable", "error");
// 			});
// 		}

// 		return new Promise((reject) => {
// 			reject(error);
// 		});
// 	}
// );
// export const axiosInstance = _axiosInstance;
