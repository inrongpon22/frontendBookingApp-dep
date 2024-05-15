import axios from "axios";

export const getUserById = async (userId: string, token:string) => {
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
}

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
