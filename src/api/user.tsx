import axios from "axios";
import { app_api } from "../helper/url";
import { axiosInstance } from "../helper/apiProtecter";

const language = localStorage.getItem("i18nextLng");

export const ReqOtp = async (phoneNumber: string) => {
    try {
        const reqotp = await axios.post(
            `${app_api}/requestOTP/${phoneNumber}/${language ?? "th-TH"}`
        );
        return reqotp;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const CheckOTP = async (phoneNumber: string, otp: string) => {
    try {
        const checkotp = await axios.post(`${app_api}/checkOTP`, {
            phoneNumber: phoneNumber,
            otpCode: otp,
        });
        return checkotp;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const getUserIdByAccessToken = async (
    accessToken: string,
    token: string
) => {
    token = token.replace(/"/g, "");
    try {
        const userId = await axios.post(
            `${import.meta.env.VITE_APP_API}/getUserIdAccessToken`,
            {
                access_token: accessToken, // Corrected the typo here
            },
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        return userId.data.userId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const getLineProfile = async (accessToken: string) => {
    try {
        const lineProfile = await axios.get(
            `${
                import.meta.env.VITE_APP_API
            }/get-line-profile?accessToken=${accessToken}`
        );
        return lineProfile.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const checkTokenValidity = async () => {
    try {
        const response = await axiosInstance.get(`/auth/status`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
