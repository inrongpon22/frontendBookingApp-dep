import axios from "axios";
import { InsertService } from "../pages/business/interfaces/service";

export const addService = async (
    serviceData: InsertService
    // token: string
) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_SERVICE_URL}/service`,
            serviceData,
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
