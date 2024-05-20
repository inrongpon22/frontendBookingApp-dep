import axios from "axios";
import { app_api } from "../helper/url";

const language = localStorage.getItem("lang");

export const getUserById = async (userId: string, token: string) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_APP_API}/user/${userId}`,
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const insertUser = async (userData: { phoneNumber: string }) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_APP_API}/user`,
            userData
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const ReqOtp = async (phoneNumber: string) => {
    try {
        const reqotp = await axios.post(
            `${app_api}/requestOTP/${phoneNumber}/${language}`
        );
        return reqotp;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const CheckOTP = async (phoneNumber: string, otp:string) => {
    try {
        const checkotp = await axios.post(
            `${app_api}/checkOTP`, {
                phoneNumber: phoneNumber,
                otpCode: otp,
            }
        );
        return checkotp;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
