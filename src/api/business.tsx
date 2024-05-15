import axios from "axios";
import { IaddBusiness } from "../pages/business/interfaces/business";

export const insertBusiness = async (
    businessData: IaddBusiness,
    token: string
) => {
    token = token.replace(/"/g, "");
    try {
        return await axios.post(
            `${import.meta.env.VITE_APP_API}/business`,
            businessData,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateBusiness = async (
    businessData: IaddBusiness,
    businessId: number,
    token: string
) => {
    token = token.replace(/"/g, "");
    try {
        return await axios.post(
            `${import.meta.env.VITE_APP_API}/business/${businessId}`,
            businessData,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getBusinessId = async (businessId: number, token: string) => {
    token = token.replace(/"/g, "");
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

export const getBusinessByUserId = async (userId: string, token: string) => {
    token = token.replace(/"/g, "");
    try {
        const business = await axios.get(
            `${import.meta.env.VITE_APP_API}/getBusinessByUserId/${userId}`,
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
