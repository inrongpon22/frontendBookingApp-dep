import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
export const DialogContext = createContext<any>(null); //create context to store all the data
import { GlobalContext } from "../../contexts/BusinessContext";
import { useTranslation } from "react-i18next";
// api & fetching data
import axios from "axios";
import { app_api, useQuery } from "../../helper/url";
import { CheckOTP, ReqOtp } from "../../api/user";
// form validateion
import { useFormik } from "formik";
// styled
import toast from "react-hot-toast";
import { DialogTypes, confirmationDialogSchemas } from "./dialogTypes"; //typescript types
import { Dialog, DialogContent, Slide, Toolbar } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
// icons
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
// components
import PhoneInput from "./PhoneInput";
import OtpVerify from "./OtpVerify";
import BookingDetailsPreview from "./BookingDetailsPreview";
import BookingApprovalSummary from "./BookingApprovalSummary";
import BookingApprovalReject from "./BookingApprovalReject";
import BusinessProfileMoreOptions from "./BusinessProfileMoreOptions";
import BookingApproveResult from "./BookingApproveResult";
import ManualBooking from "../../pages/manual-booking/ManualBooking";
import { useAuth } from "../../contexts/AuthContext";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogWrapper = ({ userSide }: DialogTypes) => {
    const navigate = useNavigate();
    const query = useQuery();
    const { t } = useTranslation();

    const { login } = useAuth();

    const {
        setIsGlobalLoading,
        showDialog,
        setShowDialog,
        dialogState,
        setDialogState,
    } = useContext(GlobalContext);

    const formik = useFormik({
        initialValues: {
            userId: 0,
            username: "",
            phoneNumbers: "",
            otp: "",
            additionalNotes: "",
            isSendSMS: true,
            isBusinessOnly: false,
        },
        validationSchema:
            confirmationDialogSchemas[
            dialogState as keyof typeof confirmationDialogSchemas
            ],
        onSubmit: async (values) => {
            switch (dialogState) {
                case "phone-input":
                    setIsGlobalLoading(true);
                    await ReqOtp(values.phoneNumbers)
                        .then((res) => {
                            console.log(res);
                            if (res.status === 200) {
                                setIsGlobalLoading(false);
                                setDialogState("otp-verify");
                            }
                        })
                        .catch((err) => {
                            if (err.response.status === 429) {
                                formik.setFieldError(
                                    "phoneNumbers",
                                    t("error:tooManyRequest")
                                );
                            }
                            setIsGlobalLoading(false);
                        });
                    break;

                case "otp-verify":
                    setIsGlobalLoading(true);
                    await CheckOTP(values.phoneNumbers, values.otp)
                        .then(async (res) => {
                            if (res.status === 200) {
                                localStorage.setItem("token", res.data.token);
                                localStorage.setItem("userId", res.data.userId);
                                localStorage.setItem(
                                    "accessToken",
                                    res.data.sessionToken
                                );
                                formik.setFieldValue("userId", res.data.userId);
                                formik.setFieldValue(
                                    "username",
                                    res.data.userName
                                );
                                setIsGlobalLoading(false);

                                switch (userSide) {
                                    case "user":
                                        query.get("accessCode")
                                            ? setShowDialog(false)
                                            : setDialogState(
                                                "booking-detail-preview"
                                            );
                                        break;

                                    case "business":
                                        if (query.get("accessCode")) {
                                            setDialogState(
                                                "booking-approval-summary"
                                            );
                                        } else {
                                            axios
                                                .get(
                                                    `${app_api}/getBusinessByUserId/${res.data.userId}`,
                                                    {
                                                        headers: {
                                                            Authorization:
                                                                res.data.token,
                                                        },
                                                    }
                                                )
                                                .then((resp) => {
                                                    if (resp.data.length > 0) {
                                                        login();
                                                        setShowDialog(false);
                                                        navigate(
                                                            `/business-profile/${resp.data[0].id}`
                                                        );
                                                    } else {
                                                        navigate(
                                                            "/create-business"
                                                        );
                                                    }
                                                })
                                                .catch((err) => {
                                                    if (
                                                        err.response.status ===
                                                        404
                                                    ) {
                                                        navigate(
                                                            "/create-business"
                                                        );
                                                    } else {
                                                        console.log(
                                                            err.message
                                                        );
                                                        toast.error(
                                                            "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง"
                                                        );
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
                            setIsGlobalLoading(false);
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
                return <BookingApproveResult />;

            case "booking-approval-result-rejected":
                return <BookingApproveResult />;

            case "business-more-options":
                return <BusinessProfileMoreOptions />;

            case "manual-booking":
                return <ManualBooking />;

            default:
                break;
        }
    };

    const handleBackButton = () => {
        switch (dialogState) {
            case "phone-input":
                setShowDialog(false);
                break;

            case "otp-verify":
                setDialogState("phone-input");
                break;

            case "booking-detail-preview":
                formik.resetForm();
                setDialogState("phone-input");
                setShowDialog(false);
                break;

            case "booking-approval-summary":
                formik.resetForm();
                setShowDialog(false);
                break;

            case "booking-approval-reject":
                formik.resetForm();
                setDialogState("booking-approval-summary");
                break;

            case "business-more-options":
                setShowDialog(false);
                setDialogState("business-more-options");
                break;

            case "manual-booking":
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
            }}>
            <Dialog
                maxWidth="xl"
                fullWidth
                fullScreen
                open={showDialog}
                style={{ zIndex: 1000 }}
                classes={{
                    paper:
                        dialogState === "business-more-options"
                            ? "custom-dialog"
                            : "",
                }}
                TransitionComponent={Transition}
                onClose={() => setShowDialog(false)}>
                {dialogState !== "business-more-options" && (
                    <Toolbar className="grid grid-cols-4">
                        <span
                            className={`w-[24px] h-[24px] cursor-pointer ${
                                // query.get("accessCode") &&
                                dialogState === "booking-approval-reject"
                                    ? "hidden"
                                    : ""
                                }`}
                            onClick={handleBackButton}>
                            {[
                                "phone-input",
                                "booking-approval-summary",
                                "business-more-options",
                            ].includes(dialogState) ? (
                                <CloseRoundedIcon />
                            ) : (
                                <ArrowBackIosNewRoundedIcon />
                            )}
                        </span>
                        <span className="w-full text-[14px] font-semibold col-span-3 text-center">
                            {DialogHeader()}
                        </span>
                        {/* empty space for balance title header */}
                        <span className="w-[24px] h-[24px] invisible">
                            <ArrowBackIosNewRoundedIcon />
                        </span>
                        {/* empty space for balance title header */}
                    </Toolbar>
                )}
                <DialogContent>{SwitchState()}</DialogContent>
            </Dialog>
        </DialogContext.Provider>
    );
};

export default DialogWrapper;
