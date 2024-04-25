import React, { createContext, useState } from "react";
export const DialogContext = createContext<any>(null); //create context to store all the data
import { useTranslation } from "react-i18next";
// api & fetching data
import axios from "axios";
import { app_api } from "../../helper/url";
// form validateion
import { useFormik } from "formik";
// styled
import { DialogTypes, confirmationDialogSchemas } from "./dialogTypes"; //typescript types
import { Dialog, DialogContent, Slide, Toolbar } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
// icons
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// components
import PhoneInput from "./PhoneInput";
import OtpVerify from "./OtpVerify";
import BookingDetailsPreview from "./BookingDetailsPreview";
import { Toast } from "../../helper/alerts";
import { useNavigate } from "react-router-dom";
import BookingApprovalSummary from "./BookingApprovalSummary";
import BookingApprovalReject from "./BookingApprovalReject";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogWrapper = ({
  show,
  setShow,
  userSide,
  dialogState,
  setDialogState,
}: DialogTypes) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      userId: 0,
      username: "",
      phoneNumbers: "",
      otp: "",
      additionalNotes: "",
    },
    validationSchema:
      confirmationDialogSchemas[
        dialogState as keyof typeof confirmationDialogSchemas
      ],
    onSubmit: async (values) => {
      switch (dialogState) {
        case "phone-input":
          setIsLoading(true);
          await axios
            .post(`${app_api}/requestOTP/${values.phoneNumbers}`)
            .then(async (res) => {
              if (res.status === 200) {
                setIsLoading(false);
                setDialogState("otp-verify");
              }
            })
            .catch((err) => {
              if (err.response.status === 429) {
                formik.setFieldError(
                  "phoneNumbers",
                  `${err.response.data}, please try again in 60 seconds`
                );
              }
              setIsLoading(false);
            });
          break;

        case "otp-verify":
          setIsLoading(true);
          await axios
            .post(`${app_api}/checkOTP`, {
              phoneNumber: values.phoneNumbers,
              otpCode: values.otp,
            })
            .then(async (res) => {
              if (res.status === 200) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.userId);
                formik.setFieldValue("userId", res.data.userId);
                formik.setFieldValue("username", res.data.userName);
                setIsLoading(false);

                console.log(userSide)

                switch (userSide) {
                  case "user":
                    setDialogState("booking-detail-preview");
                    break;

                  case "business":
                    axios
                      .get(
                        `${app_api}/getBusinessByUserId/${res.data.userId}`,
                        {
                          headers: {
                            Authorization: res.data.token,
                          },
                        }
                      )
                      .then((resp) => {
                        if (resp.status === 200) {
                          navigate(`/bussiness-profile/${resp.data[0].id}`);
                        } else if (resp.status === 404) {
                          navigate("/createBusiness/1");
                        }
                      })
                      .catch((err) => {
                        Toast.fire({
                          icon: "error",
                          title: err.message,
                        });
                      });
                    break;

                  default:
                    break;
                }
              }
            })
            .catch((err) => {
              formik.setFieldError(
                "otp",
                `${err.response.data.message} ${err.message}`
              );
              setIsLoading(false);
            });
          break;

        default:
          break;
      }
    },
  });

  const DialogHeader = (): string => {
    switch (dialogState) {
      case "booking-approval-summary":
        return "Booking Approval"

      case "booking-approval-reject":
        return "Booking Rejection"

      default:
        return t("title:confirmBookingDialogHeader")
    }
  };

  const SwitchState = () => {
    switch (dialogState) {
      case "phone-input":
        return <PhoneInput />;

      case "otp-verify":
        return <OtpVerify />;

      case "booking-detail-preview":
        return <BookingDetailsPreview />;

      case "booking-approval-summary":
        return <BookingApprovalSummary />;

      case "booking-approval-reject":
        return <BookingApprovalReject />;

      default:
        break;
    }
  };

  const handleBackButton = () => {
    switch (dialogState) {
      case "phone-input":
        setShow(false);
        break;

      case "otp-verify":
        setDialogState("phone-input");
        break;

      case "booking-detail-preview":
        formik.resetForm();
        setDialogState("phone-input");
        setShow(false);
        break;

      case "booking-approval-summary":
        formik.resetForm();
        setShow(false);
        break;

      case "booking-approval-reject":
        formik.resetForm();
        setDialogState("booking-approval-summary");
        break;

      default:
        break;
    }
  };

  return (
    <DialogContext.Provider
      value={{ formik, dialogState, setDialogState, isLoading, setIsLoading }}
    >
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        fullScreen
        open={show}
        style={{ zIndex: 1000 }}
        TransitionComponent={Transition}
      >
        <Toolbar className="grid grid-cols-4">
          <span className="w-[24px] h-[24px]" onClick={handleBackButton}>
            {dialogState === "phone-input" ||
            dialogState === "booking-approval-summary" ? (
              <CloseIcon />
            ) : (
              <ArrowBackIosIcon />
            )}
          </span>
          <span className="w-full font-semibold col-span-3 text-center">
            {DialogHeader()}
            {/* {dialogState === "booking-approval-summary" ||
            dialogState === "booking-approval-reject"
              ? "Booking Approval"
              : t("title:confirmBookingDialogHeader")} */}
          </span>
        </Toolbar>
        <DialogContent>{SwitchState()}</DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogWrapper;
