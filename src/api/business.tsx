import axios from "axios";
import { IaddBusiness } from "../pages/business/interfaces/business";

export const insertBusiness = async (businessData: IaddBusiness) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_SERVICE_URL}/business`,
            businessData
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};