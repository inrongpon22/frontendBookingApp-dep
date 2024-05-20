import axios from "axios";
import { IaddBusiness } from "../pages/business/interfaces/business";
import useSWR from "swr";
import { app_api } from "../helper/url";
import { IBusunessId } from "../interface/business";

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

export const getBusinessId = (businessId: number) => {
    const { data, error, isLoading } = useSWR<IBusunessId>(
        `${app_api}/business/${businessId}`,
        (url: string) =>
            axios
                .get(url, {
                    headers: {
                        authorization: localStorage.getItem("token"),
                    },
                })
                .then((res) => res.data)
    );

    return {
        businessData: data,
        businessError: error,
        businessLoading: isLoading,
    };
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
