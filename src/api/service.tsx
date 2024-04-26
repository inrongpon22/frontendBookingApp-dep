import axios from "axios";
import { IService, InsertService } from "../pages/business/interfaces/service";

export const addService = async (serviceData: InsertService, token: string) => {
    console.log(token);
    try {
        const business = await axios.post(
            `${import.meta.env.VITE_APP_API}/service`,
            serviceData,
            {
                headers: {
                    Authorization: `${token}`,
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
    token: string
) => {
    try {
        const services = await axios.get(
            `${import.meta.env.VITE_APP_API}/serviceByBusinessId/${businessId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        return services.data as IService[];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
