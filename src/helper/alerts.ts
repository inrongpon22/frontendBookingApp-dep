import toast from "react-hot-toast";

export const shareBookingLink = (id: string | number | undefined) => {
  navigator.clipboard.writeText(`${window.location.origin}/details/${id}`);
  toast("Link copied")
};