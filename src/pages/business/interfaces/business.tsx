export interface ILocation {
    lat: number;
    lng: number;
    address: string;
}

export interface IBusinessInfo {
    title: string;
    daysOpen?: string[];
    openTime:string;
    closeTime:string;
    location: string;
    description: string;
    phoneNumber: string;
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

export interface IBusinessInfoList {
    title: string;
    address: string;
    daysOpen: string[];
    phoneNumber: string;
}

export interface IgetBusiness {
    id: number;
    title: string;
    imagesURL: string[];
    description: string;
    phoneNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    daysOpen: string[];
    openTime: string;
    closeTime: string;
    userId: number;
}
