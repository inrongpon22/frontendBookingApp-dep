import axios from "axios";

export const insertUser = async (userData: { phoneNumber: string }) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_EVENT_SOCKET}/user`,
            userData
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};
