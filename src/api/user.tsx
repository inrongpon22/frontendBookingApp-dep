import axios from "axios";
import { app_api } from "../helper/url";

const language = localStorage.getItem("lang");

export const ReqOtp = async (phoneNumber: string) => {
    try {
        const reqotp = await axios.post(
            `${app_api}/requestOTP/${phoneNumber}/${language ?? "th"}`
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
