export interface ILocation {
    lat: number;
    lng: number;
    address: string;
}

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

export interface IBusinessInfo {
    title: string;
    daysOpen?: string[];
    openTime: string;
    closeTime: string;
    location: string;
    description: string;
    phoneNumber: string;
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

export interface IBusinessesById {
    id: number;
    address: string;
    openTime: string;
    closeTime: string;
    daysOpen: string[];
    created_at: string;
    description: string;
    imagesURL: string[];
    latitude: number;
    longitude: number;
    phoneNumber: string;
    title: string;
    userId: number;
}

export interface IaddBusiness {
    title: string;
    imagesURL: string[];
    description: string;
    phoneNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    daysOpen: string[];
    userId: number;
}
