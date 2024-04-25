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
    bookingSlots: IBookingSlot[];
    availableFromDate: string;
    availableToDate: string | null;
}
