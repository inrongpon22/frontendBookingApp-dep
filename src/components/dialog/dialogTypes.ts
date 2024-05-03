import * as Yup from "yup";
import { t } from "i18next";

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
      .min(9, t("formValidation:business:auth:phoneNumber:phoneNumberMin"))
      .max(10, t("formValidation:business:auth:phoneNumber:phoneNumberMax"))
      .required(t("formValidation:business:auth:phoneNumber:phoneNumberReq")),
  }),
  "otp-verify": Yup.object().shape({
    otp: Yup.string()
      .min(6, t("formValidation:business:auth:otp:otpMin"))
      .max(6, t("formValidation:business:auth:otp:otpMax"))
      .required(t("formValidation:business:auth:otp:otpReq")),
  }),
  "booking-detail-preview": Yup.object().shape({
    username: Yup.string()
      .min(1, t("formValidation:booking:create:username:usernamesMin"))
      .required(t("formValidation:booking:create:username:usernameReq")),
    phoneNumbers: Yup.string()
      .min(9, t("formValidation:booking:create:phoneNumbers:phoneNumbersMin"))
      .required(
        t("formValidation:booking:create:phoneNumbers:phoneNumbersReq")
      ),
    additionalNotes: Yup.string(),
  }),
};
