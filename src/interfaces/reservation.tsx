export interface Ireservation {
    id: string | number;
    serviceId: string | number;
    phoneNumber: string;
    remark: string;
    startTime: string;
    endTime: string;
    approveAt: string;
    cancelAt: null;
    created_at: string;
    status: string;
    by: "customer" | "business";
    userName: string;
    bookingDate: string | object;
    guestNumber: number;
    userId: string | number;
    uuid: string | undefined;
    isDelete: boolean;
    title: string;
    price: string;
    address: string;
}
