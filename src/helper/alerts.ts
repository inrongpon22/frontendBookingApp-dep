import Swal, { SweetAlertIcon } from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const shareBookingLink = (id: string | number | undefined) => {
  navigator.clipboard.writeText(`${window.location.origin}/details/${id}`);
  Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  }).fire({
    title: "Link copied",
    position: "bottom",
  });
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
