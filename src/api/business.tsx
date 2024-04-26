import axios from "axios";
import { IaddBusiness } from "../pages/business/interfaces/business";

export const insertBusiness = async (
    businessData: IaddBusiness
    // token: string
) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_APP_API}/business`,
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

export const getBusinessId = async (businessId: number, token: string) => {
    try {
        const business = await axios.get(
            `${import.meta.env.VITE_APP_API}/business/${businessId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        return business.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
