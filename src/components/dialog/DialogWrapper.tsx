import React, { createContext, useState } from "react";
export const DialogContext = createContext<any>(null); //create context to store all the data
import { useTranslation } from "react-i18next";
// api & fetching data
import axios from "axios";
import { app_api, useQuery } from "../../helper/url";
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
import { useNavigate } from "react-router-dom";
import BookingApprovalSummary from "./BookingApprovalSummary";
import BookingApprovalReject from "./BookingApprovalReject";
import BusinessProfileMoreOptions from "./BusinessProfileMoreOptions";
import toast from "react-hot-toast";
import BookingApproveResult from "./BookingApproveResult";

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
  const query = useQuery();
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
            .post(`${app_api}/requestOTP/${values.phoneNumbers}/th`)
            .then(async (res) => {
              if (res.status === 200) {
                setIsLoading(false);
                setDialogState("otp-verify");
              }
            })
            .catch((err) => {
              if (err.response.status === 429) {
                formik.setFieldError("phoneNumbers", t("error:tooManyRequest"));
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

                switch (userSide) {
                  case "user":
                    setDialogState("booking-detail-preview");
                    break;

                  case "business":
                    if (query.get("accessCode")) {
                      setDialogState("booking-approval-summary");
                    } else {
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
                            navigate(`/business-profile/${resp.data[0].id}`);
                          }
                        })
                        .catch((err) => {
                          if (err.response.status === 404) {
                            navigate("/createBusiness");
                          } else {
                            toast.error(err.message);
                          }
                        });
                    }
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
      case "booking-detail-preview":
        return t("title:confirmBookingDialogHeader");

      case "booking-approval-summary":
        return t("title:bookingApproval");

      case "booking-approval-reject":
        return t("title:bookingReject");

      default:
        return "";
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

      case "booking-approval-result-success":
        return <BookingApproveResult dialogState={dialogState} />;

      case "booking-approval-result-rejected":
        return <BookingApproveResult dialogState={dialogState} />;

      case "business-more-options":
        return <BusinessProfileMoreOptions />;

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

      case "business-more-options":
        formik.resetForm();
        setShow(false);
        setDialogState("business-more-options");
        break;

      default:
        break;
    }
  };

  return (
    <DialogContext.Provider
      value={{
        formik,
        dialogState,
        setDialogState,
        isLoading,
        setIsLoading,
      }}
    >
      <Dialog
        maxWidth="xl"
        fullWidth
        fullScreen
        open={show}
        style={{ zIndex: 1000 }}
        classes={{
          paper: dialogState === "business-more-options" ? "custom-dialog" : "",
        }}
        TransitionComponent={Transition}
        onClose={() => setShow(false)}
      >
        {dialogState !== "business-more-options" && (
          <Toolbar className="grid grid-cols-4">
            <span
              className={`w-[24px] h-[24px] cursor-pointer ${
                query.get("accessCode") && dialogState !== "booking-approval-reject" ? "hidden" : ""
              }`}
              onClick={handleBackButton}
            >
              {dialogState === "phone-input" ||
              dialogState === "booking-approval-summary" ||
              dialogState === "business-more-options" ? (
                <CloseIcon />
              ) : (
                <ArrowBackIosIcon />
              )}
            </span>
            <span className="w-full font-semibold col-span-3 text-center">
              {DialogHeader()}
            </span>
          </Toolbar>
        )}
        <DialogContent>{SwitchState()}</DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogWrapper;
