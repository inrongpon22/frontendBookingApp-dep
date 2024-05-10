import axios from "axios";
import {
    IService,
    InsertService,
    IEditServiceInfo,
    IServiceEditTime,
    IServiceShowHide,
} from "../pages/business/interfaces/service";

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
            `${
                import.meta.env.VITE_APP_API
            }/getListServiceByBusinessId/${businessId}?page=1&limit=10`,
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
        const response = await axios.put(
            `${
                import.meta.env.VITE_APP_API
            }/deleteServiceByHidden/${serviceId}`,
            {},
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getServiceByServiceId = async (
    serviceId: number,
    token: string
) => {
    token = token.replace(/"/g, "");
    try {
        const services = await axios.get(
            `${
                import.meta.env.VITE_APP_API
            }/getServiceByServiceId/${serviceId}`,
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

export const updateServiceInfo = async (
    serviceData: IEditServiceInfo,
    token: string,
    serviceId: number
) => {
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

export const updateServiceTime = async (
    serviceData: IServiceEditTime[],
    token: string,
    serviceId: number
) => {
    token = token.replace(/"/g, "");
    try {
        const business = await axios.post(
            `${import.meta.env.VITE_APP_API}/updateServiceTime/${serviceId}`,
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

export const updateServiceShowHide = async (
    serviceData: IServiceShowHide,
    token: string,
    serviceId: number
) => {
    console.log(serviceData);
    token = token.replace(/"/g, "");
    try {
        const business = await axios.post(
            `${
                import.meta.env.VITE_APP_API
            }/updateServiceShowHide/${serviceId}`,
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
