export interface IBookingSlot {
    startTime: string;
    endTime: string;
    capacity: number;
}

export interface ISpecialOpenDate {
    openDate: string;
    startTime: string;
    endTime: string;
    capacity: number;
}

export interface InsertService {
    businessId: number;
    title: string;
    duration: number;
    description: string;
    price: number;
    requireApproval: boolean;
    daysOpen: string[];
    currency: string;
    openTime: string;
    closeTime: string;
    specialOpenDate?: ISpecialOpenDate[];
    bookingSlots: {
        daysOpen: string[];
        availableFromDate: string;
        availableToDate: string | null;
        slotsTime: IBookingSlot[];
    }[];
    availableFromDate: string;
    availableToDate: string | null;
    isHidePrice: boolean;
}

export interface IService {
    businessName: string;
    address: string;
    daysOpen: string[]; // You might want to change the type to match the actual data type
    phoneNumber: string;
    title: string;
    price: number; // Assuming it's a number
    description: string;
    currency: string;
    openTime: string; // Assuming it's a string representing time
    closeTime: string; // Assuming it's a string representing time
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