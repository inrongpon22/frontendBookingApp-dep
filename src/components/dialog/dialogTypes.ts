import * as Yup from "yup";

export interface DialogTypes {
  show: boolean;
  setShow: Function;
  userSide: "user" | "business";
  dialogState: string | undefined;
  setDialogState: Function;
}

// Define your validation schemas
export const confirmationDialogSchemas = {
  "phone-input": Yup.object().shape({
    phoneNumbers: Yup.string()
      .min(
        9,
        "Your phone numbers is too short. It must be at least 9 numbers long."
      )
      .max(10, "Your phone numbers is too long. It must be 10 numbers long.")
      .required("Phone number is required"),
  }),
  "otp-verify": Yup.object().shape({
    otp: Yup.string()
      .min(6, "OTP must be 6 numbers long.")
      .max(6, "OTP must be 6 numbers long.")
      .required("Username is required"),
  }),
  "booking-detail-preview": Yup.object().shape({
    username: Yup.string()
      .min(
        1,
        "Your username is too short. It must be at least 1 characters long."
      )
      .required("Username is required"),
    phoneNumbers: Yup.string()
      .min(
        9,
        "Your phone numbers is too short. It must be at least 9 numbers long."
      )
      .required("Phone number is required"),
    additionalNotes: Yup.string(),
  }),
};
