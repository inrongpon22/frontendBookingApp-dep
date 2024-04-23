import * as Yup from "yup";
export interface shopDetailTypes {
  id: string | number;
  title: string;
  address: string;
  description: string;
  imagesURL: string[];
  latitude: string | number;
  longitude: string | number;
  phoneNumber: string;
  userId: string;
  created_at: string;
}

export interface serviceTypes {
  id: string;
  title: string;
  bookInAdvanceDays: number;
  businessId: string;
  capacity: number;
  closeTime: string;
  created_at: string;
  currency: string;
  daysOpen: string[];
  description: string;
  duration: number;
  isSelected: true;
  openTime: string;
  price: number;
  requireApproval: boolean;
  specialOpenDate: { openDate: string; isRepeat: boolean }[];
  specialOpenTime: {
    capacity: number;
    closeTime: string;
    duration: number;
    isRepeat: boolean;
    openTime: string;
  }[];
}

export interface quantityTypes {
  title: string;
  desc?: string;
  additionalNotes?: string;
  quantities: number;
  max: number;
  min: number;
}

export interface openTimeTypes {
  label: string;
  isAvailiable: boolean;
  isSelected: boolean;
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