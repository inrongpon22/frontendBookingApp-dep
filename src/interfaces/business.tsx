export interface IBusiness {
    title: string;
    imagesURL: string[];
    descript: string;
    phoneNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    userId: number;
}

export interface IBusunessId {
    id: string;
    created_at: string;
    title: string;
    imagesURL: string[];
    description: string;
    phoneNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    userId: string;
    daysOpen: string[];
    openTime: string;
    closeTime: string;
}
