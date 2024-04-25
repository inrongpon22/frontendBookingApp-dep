import axios from "axios";
import { IService, InsertService } from "../pages/business/interfaces/service";

export const addService = async (
    serviceData: InsertService
    // token: string
) => {
    try {
        const business = await axios.post(
            `${import.meta.env.VITE_SERVICE_URL}/service`,
            serviceData,
            {
                headers: {
                    Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMyIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3MTQwMzc3OTcsImV4cCI6MTcxNDEyNDE5N30.w26OgvVKfT7L5Mse7eAuuShy_9YVXwgkcdmRA6mPIFA`,
                },
            }
        );
        return business.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getServiceByBusinessId = async (
    businessId: number,
    // token: string
) => {
    try {
        const services = await axios.get(
            `${import.meta.env.VITE_SERVICE_URL}/serviceByBusinessId/${businessId}`,
            {
                headers: {
                    Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMyIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3MTQwNTIyMTMsImV4cCI6MTcxNDEzODYxM30.Rkw__TJ2BVhmMqol9aHRZ9YtUgOY74zSeRETQjU3Wq0`,
                },
            }
        );

        return services.data as IService[];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
