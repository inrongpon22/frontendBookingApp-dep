import { IServiceEditTime } from "../../business/interfaces/service";

export interface IServiceTime {
    openTime: string;
    closeTime: string;
    bookingSlots: IServiceEditTime[];
}