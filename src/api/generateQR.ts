import { axiosInstance } from "../helper/apiProtecter";

export const generateShortURL = async (originalURL: string) => {
    try {
        const shortURL = await axiosInstance.post(`/shortURL`, {
            originalURL: originalURL,
        });
        return shortURL.data.shortURL;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
