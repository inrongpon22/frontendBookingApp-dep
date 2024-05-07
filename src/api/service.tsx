import axios from "axios";
import { IService, InsertService, IEditServiceInfo } from "../pages/business/interfaces/service";

export const addService = async (serviceData: InsertService, token: string) => {
    token = token.replace(/"/g, "");
    try {
        const business = await axios.post(
            `${import.meta.env.VITE_APP_API}/service`,
            serviceData,
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

export const getServiceByBusinessId = async (
    businessId: number,
    token: string
) => {
    token = token.replace(/"/g, "");
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

export const deleteService = async (serviceId: number, token: string) => {
    token = token.replace(/"/g, "");
    try {
        const services = await axios.delete(
            `${import.meta.env.VITE_APP_API}/service/${serviceId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        return services.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getServiceByServiceId = async (serviceId: number, token: string) => {
    token = token.replace(/"/g, "");
    try {
        const services = await axios.get(
            `${import.meta.env.VITE_APP_API}/getServiceByServiceId/${serviceId}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        return services.data as any;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateServiceInfo = async (serviceData: IEditServiceInfo, token: string, serviceId: number) => {
    token = token.replace(/"/g, "");
    try {
        const business = await axios.post(
            `${import.meta.env.VITE_APP_API}/updateServiceInfo/${serviceId}`,
            serviceData,
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
