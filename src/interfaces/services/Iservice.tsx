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
    // duration: number;
    description: string;
    price: number;
    isAutoApprove: boolean;
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
    isHideEndTime: boolean;
}

export interface IService {
    id: number;
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
    isHidePrice: boolean;
    isHideEndTime: boolean;
    isDeleted: boolean;
    bookingSlots?: {
        daysOpen: string[];
        availableFromDate: string;
        availableToDate: string | null;
        slotsTime: IBookingSlot[];
    }[];
}

export interface IServiceTime {
    daysOpen: string[];
    openTime: string;
    closeTime: string;
    duration: number;
    guestNumber: number;
    TimeSlots: string[];
    selectedSlots: number[];
    slotsTime: IBookingSlot[];
    availableFromDate: string;
    availableToDate: string;
}

export interface IServiceInfo {
    serviceName: string;
    serviceDescription: string;
    price: number;
    currency: string;
}

export interface IEditServiceInfo {
    title: string;
    description: string;
    price: number;
    currency: string;
}

export interface IServiceShowHide {
    isHidePrice: boolean;
    isHideEndTime: boolean;
    isAutoApprove: boolean;
}

export interface IServiceByServiceId {
    id: number;
    availableFromDate: string;
    availableToDate: string | null;
    businessId: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    isAutoApprove: boolean;
    isHidePrice: boolean;
    isHideEndTime: boolean;
    openTime: string;
    closeTime: string;
    isDeleted: boolean;
    created_at: string;
    duration: number | null;
    totalCapacity: number;
    bookingSlots: {
        daysOpen: string[];
        availableFromDate: string;
        availableToDate: string | null;
        duration: number;
        slotsTime: IBookingSlot[];
        isLimitBooking: boolean;
        maximumAllow: number;
    }[];
}

export interface IServiceEditTime {
    daysOpen: string[];
    availableFromDate: string;
    availableToDate: string | null;
    slotsTime: IBookingSlot[];
    duration: number;
    manualCapacity?: IBookingSlot[];
    isLimitBooking: boolean;
    maximumAllow: number;
}

export interface IUpdateService {
    businessId: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    isAutoApprove: boolean;
    isHidePrice: boolean;
    isHideEndTime: boolean;
    bookingSlots: IServiceEditTime[];
}
