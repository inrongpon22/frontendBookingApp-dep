import axios from "axios";
import { app_api } from "../helper/url";

export const cancelBooking = async (
  token: string,
  bookingId: number | string | undefined,
  serviceId: string | number,
  lang:string
) => {
  token = token.replace(/"/g, "");
  try {
    const booking = await axios.post(
      `${app_api}/cancelReservation/${bookingId}/${serviceId}/${lang}/customer`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return booking.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
