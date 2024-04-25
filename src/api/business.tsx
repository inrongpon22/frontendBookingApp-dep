import axios from "axios";
import { IaddBusiness } from "../pages/business/interfaces/business";

export const insertBusiness = async (
    businessData: IaddBusiness,
    // token: string
) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_SERVICE_URL}/business`,
            businessData,
            {
                headers: {
                    Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMyIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3MTQwMzc3OTcsImV4cCI6MTcxNDEyNDE5N30.w26OgvVKfT7L5Mse7eAuuShy_9YVXwgkcdmRA6mPIFA`,
                },
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};