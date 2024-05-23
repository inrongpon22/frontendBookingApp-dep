import * as Yup from "yup";
import { t } from "i18next";

export interface DialogTypes {
    userSide: "user" | "business";
}

// Define your validation schemas
export const confirmationDialogSchemas = {
    "phone-input": Yup.object().shape({
        phoneNumbers: Yup.string()
            .min(
                9,
                t("formValidation:business:auth:phoneNumber:phoneNumberMin")
            )
            .max(
                10,
                t("formValidation:business:auth:phoneNumber:phoneNumberMax")
            )
            .required(
                t("formValidation:business:auth:phoneNumber:phoneNumberReq")
            ),
    }),
    "otp-verify": Yup.object().shape({
        otp: Yup.string()
            .min(6, t("formValidation:business:auth:otp:otpMin"))
            .max(6, t("formValidation:business:auth:otp:otpMax"))
            .required(t("formValidation:business:auth:otp:otpReq")),
    }),
    "booking-detail-preview": Yup.object().shape({
        username: Yup.string().when([], (_, schema) => {
            return !window.location.pathname.includes("business")
                ? schema
                      .min(
                          1,
                          t(
                              "formValidation:booking:create:username:usernamesMin"
                          )
                      )
                      .required(
                          t(
                              "formValidation:booking:create:username:usernameReq"
                          )
                      )
                : schema;
        }),
        phoneNumbers: Yup.string().when([], (_, schema) => {
            return !window.location.pathname.includes("business")
                ? schema
                      .min(
                          9,
                          t(
                              "formValidation:booking:create:phoneNumbers:phoneNumbersMin"
                          )
                      )
                      .required(
                          t(
                              "formValidation:booking:create:phoneNumbers:phoneNumbersReq"
                          )
                      )
                : schema.when("isSendSMS", {
                      is: true,
                      then: (schema: any) =>
                          schema
                              .min(
                                  9,
                                  t(
                                      "formValidation:booking:create:phoneNumbers:phoneNumbersMin"
                                  )
                              )
                              .required(
                                  t(
                                      "formValidation:booking:create:phoneNumbers:phoneNumbersReq"
                                  )
                              ),
                      otherwise: (schema: any) => schema,
                  });
        }),
        additionalNotes: Yup.string(),
        isSendSMS: Yup.boolean(),
        isBusinessOnly: Yup.boolean(),
    }),
};
