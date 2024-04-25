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
    imagesURL: string[];
    description: string;
    phoneNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    daysOpen: string[];
    userId: number;
}

export interface IBookingSlot {
    startTime: string;
    endTime: string;
    capacity: number;
}

export interface IServiceTime {
    daysOpen: string[];
    openTime: string;
    closeTime: string;
    duration: number;
    guestNumber: number;
    TimeSlots: string[];
    selectedSlots: number[];
    manualCapacity: IBookingSlot[];
    availableFromDate: string;
    availableToDate: string;
}

export interface IServiceInfo {
    serviceName: string;
    serviceDescription: string;
    price: number;
    currency: string;
}
