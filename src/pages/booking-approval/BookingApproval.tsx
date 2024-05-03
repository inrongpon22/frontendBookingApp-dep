import { createContext, useEffect, useState } from "react";
export const ApproveContext = createContext<any>(null); //create context to store all the data
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import { app_api, fetcher } from "../../helper/url";
import {
  Backdrop,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
// icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// components
import RequestCards from "../../components/business-approval/RequestCards";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Toast } from "../../helper/alerts";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const BookingApproval = () => {
  const { id, serviceId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [show, setShow] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string | undefined>(
    "booking-approval-summary"
  );
  const [bookingDatas, setBookingDatas] = useState<any>();
  const [tabStatus, setTabStatus] = useState<number>(0);
  // approval

  // const { data: getServiceById, error: ServiceByIdError } = useSWR(
  //   `${app_api}/services`,
  //   fetcher,
  //   { revalidateOnFocus: false }
  // );

  const {
    data: getReservByBusiId,
    isLoading,
    error: ReservByBusiIdError,
    mutate,
  } = useSWR(
    id && `${app_api}/getReservationByBusinessId/${id}`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) =>
          res.data
            .filter((item: any) => item.serviceId === serviceId)
            .filter(
              (item: any) =>
                item.status === `${tabStatus === 0 ? "pending" : "approval"}`
            )
        ),
    { revalidateOnFocus: false }
  );

  const approveRequested = async (id: string, serviceId: string) => {
    Swal.fire({
      icon: "warning",
      title: `<span style="font-size: 17px; font-weight: bold;">${t(
        "noti:booking:approve:confirmation"
      )}?</span>`,
      html: `<p style="font-size: 14px;">${t(
        "noti:booking:approve:confirmationDesc"
      )}</p>`,
      showCancelButton: true,
      cancelButtonText: t("button:cancel"),
      confirmButtonText: t("button:approve"),
      reverseButtons: true,
      customClass: {
        confirmButton: "border rounded-lg py-3 px-10 text-white bg-[#020873]",
        cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
        popup: "custom-swal",
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${app_api}/approveReservation/${id}/${serviceId}/th`,
            undefined,
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then(() => {
            setShow(false);
            Toast.fire({
              icon: "success",
              title: `${t("noti:booking:approve:success")}`,
            });
            setShow(false);
            mutate();
          })
          .catch((err) => {
            console.log(err);
            Toast.fire({
              icon: "error",
              title: `${t("noti:booking:approve:fail")}`,
            });
          });
      }
    });
  };

  const rejectRequested = async (id: string, serviceId: string) => {
    Swal.fire({
      icon: "warning",
      title: `<span style="font-size: 17px; font-weight: bold;">${t(
        "noti:booking:reject:confirmation"
      )}?</span>`,
      html: `<p style="font-size: 14px;">${t(
        "noti:booking:reject:confirmationDesc"
      )}</p>`,
      showCancelButton: true,
      cancelButtonText: t("button:cancel"),
      confirmButtonText: t("button:reject"),
      reverseButtons: true,
      customClass: {
        confirmButton: "border rounded-lg py-3 px-10 text-white bg-[#020873]",
        cancelButton: "border rounded-lg py-3 px-10 text-black bg-white me-5",
        popup: "custom-swal",
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${app_api}/cancelReservation/${id}/${serviceId}/th`,
            undefined,
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then(() => {
            setShow(false);
            Toast.fire({
              icon: "success",
              title: t("noti:booking:reject:success"),
            });
            setShow(false);
            mutate();
          })
          .catch((err) => {
            console.log(err);
            Toast.fire({ icon: "error", title: t("noti:booking:reject:fail") });
          });
      }
    });
  };

  const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    "& .MuiTabs-indicator": {
      backgroundColor: "#1890ff",
    },
  });

  const AntTab = styled((props: any) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      minWidth: 0,
      [theme.breakpoints.up("sm")]: {
        minWidth: 0,
      },
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
      color: "rgba(0, 0, 0, 0.85)",
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:hover": {
        color: "#40a9ff",
        opacity: 1,
      },
      "&.Mui-selected": {
        color: "#1890ff",
        fontWeight: theme.typography.fontWeightMedium,
      },
      "&.Mui-focusVisible": {
        backgroundColor: "#d1eaff",
      },
    })
  );

  useEffect(() => {
    document.title = t("title:bookingApproval");
  }, []);

  console.log(getReservByBusiId);

  if (ReservByBusiIdError) return <div>API ERROR</div>;

  return (
    <ApproveContext.Provider
      value={{
        show,
        setShow,
        mutate,
        approveRequested,
        rejectRequested,
        bookingDatas,
        setBookingDatas,
        dialogState,
        setDialogState,
      }}
    >
      <div className="h-dvh flex flex-col">
        {/* loading progress */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* loading progress */}

        <div className="flex drop-shadow-lg p-4 font-semibold text-[14px]">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowBackIosIcon fontSize="small" />
          </button>
        </div>
        <Box sx={{ bgcolor: "#fff" }}>
          <AntTabs
            value={tabStatus}
            onChange={(_, newValue: number) => setTabStatus(newValue)}
          >
            <AntTab label="รออนุมัติ" />
            <AntTab label="อนุมัติแล้ว" />
          </AntTabs>
        </Box>
        <div className="bg-gray-100">
          <p className="p-4 text-[14px]">
            {t("title:bookingRequests")} ({getReservByBusiId?.length})
          </p>
          <div className="">
            {getReservByBusiId ? (
              getReservByBusiId.map((item: any, index: number) => {
                return <RequestCards key={index} data={item} />;
              })
            ) : (
              <p className="p-4 text-[14px]">{t("error:noBookingReq")}</p>
            )}
          </div>
        </div>
        <DialogWrapper
          show={show}
          setShow={setShow}
          userSide="business"
          dialogState={dialogState}
          setDialogState={setDialogState}
        />
      </div>
    </ApproveContext.Provider>
  );
};

export default BookingApproval;
