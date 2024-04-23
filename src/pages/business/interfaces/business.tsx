export interface ILocation {
    lat: number;
    lng: number;
    address: string;
}

export interface IBusinessInfo {
    title: string;
    description: string;
    phoneNumber: string;
}

export interface IaddBusiness {
    title: string;
    imagesURL: string[],
    description: string,
    phoneNumber: string,
    address: string,
    latitude: number,
    longitude: number,
    userId: number,
}
