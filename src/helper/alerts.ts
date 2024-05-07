import toast from "react-hot-toast";
import Swal, { SweetAlertIcon } from "sweetalert2";

export const shareBookingLink = (id: string | number | undefined) => {
  navigator.clipboard.writeText(`${window.location.origin}/details/${id}`);
  toast("Link copied")
};

export const globalConfirmation = (
  title: string,
  description: string,
  confirmButton: string,
  icon?: SweetAlertIcon,
  cancelButton?: string
) => {
  return Swal.fire({
    icon: icon,
    title: `<span style="font-size: 17px; font-weight: bold;">${title}?</span>`,
    html: `<p style="font-size: 14px;">${description}</p>`,
    showCancelButton: cancelButton ? true : false,
    cancelButtonText: cancelButton,
    confirmButtonText: confirmButton,
    reverseButtons: true,
    customClass: {
      confirmButton: "border rounded-lg py-3 px-10 text-white bg-deep-blue",
      cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
      popup: "custom-swal",
    },
    buttonsStyling: false,
  });
};
