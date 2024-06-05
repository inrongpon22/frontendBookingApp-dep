import { axiosInstance } from "../helper/apiProtecter";
import { getUserIdByAccessToken } from "./user";

export const verifyOtp = async (phoneNumber: string, otp: string) => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
    try {
        const response = await axiosInstance.post(`/checkOTPForConnect`, {
            phoneNumber: phoneNumber,
            otpCode: otp,
            userId: userId,
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const disconnectPhoneNumber = async () => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
    try {
        const response = await axiosInstance.post(`/disconnectPhone`, {
            userId: userId,
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
