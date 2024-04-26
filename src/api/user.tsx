import axios from "axios";

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
