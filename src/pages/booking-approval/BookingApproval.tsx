import { createContext, useEffect, useState } from "react";
export const ApproveContext = createContext<any>(null); //create context to store all the data
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/th"; // Import the Thai locale
import toast from "react-hot-toast";
// fetcher
import useSWR from "swr";
import axios from "axios";
import { app_api } from "../../helper/url";
// styled
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
// icons
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// components
import RequestCards from "../../components/business-approval/RequestCards";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { globalConfirmation } from "../../helper/alerts";
import { dayOfWeekFullName } from "../../helper/daysOfWeek";
import { monthsOfYearFullName } from "../../helper/monthsOfYear";

const BookingApproval = (): React.ReactElement => {
  const { businessId, serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const token: string | null = localStorage.getItem("token");
  const lang: string | null = localStorage.getItem("lang");

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const [show, setShow] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<string | undefined>(
    "booking-approval-summary"
  );
  const [bookingDatas, setBookingDatas] = useState<any>();
  const [tabStatus, setTabStatus] = useState<number>(0);

  const converted = (): string => {
    switch (tabStatus) {
      case 0:
        return "pending";

      case 1:
        return "approval";

      case 2:
        return "cancel";

      default:
        return "pending";
    }
  };

  const {
    data: getReservByBusiId,
    isLoading,
    error: ReservByBusiIdError,
    mutate,
  } = useSWR(
    businessId &&
      `${app_api}/getReservationByBusinessId/${businessId}/${converted()}`,
    (url: string) =>
      axios
        .get(url, {
          headers: {
            Authorization: token,
          },
        })
        .then(async (res) => {
          const filtered = res?.data
            .filter((item: any) => item.serviceId === serviceId)
            .sort(
              (a: any, b: any) =>
                moment(a.bookingDate).valueOf() -
                moment(b.bookingDate).valueOf()
            )
            .reduce((prev: any, curr: any) => {
              const date: any = moment(curr.bookingDate); //.format("DD-MM-YYYY");
              if (!prev[date]) {
                prev[date] = [];
              }
              prev[date].push(curr);
              return prev;
            }, []);

          return Object?.keys(filtered)?.map((date) => ({
            date,
            children: filtered[date],
          }));
        }),
    { revalidateOnFocus: false }
  );

  const approveRequested = async (reservationId: string, serviceId: string) => {
    globalConfirmation(
      t("noti:booking:approve:confirmation"),
      t("noti:booking:approve:confirmationDesc"),
      t("button:approve"),
      undefined,
      t("button:cancel")
    ).then((result: any) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${app_api}/approveReservation/${reservationId}/${serviceId}/th`,
            undefined,
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then(() => {
            setShow(false);
            toast.success(t("noti:booking:approve:success"));
            setShow(false);
            mutate();
          })
          .catch((err) => {
            console.log(err);
            toast.error(t("noti:booking:approve:fail"));
          });
      }
    });
  };

  const rejectRequested = async (businessId: string, serviceId: string) => {
    globalConfirmation(
      t("noti:booking:reject:confirmation"),
      t("noti:booking:reject:confirmationDesc"),
      t("button:approve"),
      undefined,
      t("button:cancel")
    ).then((result: any) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${app_api}/cancelReservation/${businessId}/${serviceId}/${lang}/business`,
            undefined,
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then(() => {
            setShow(false);
            toast.success(t("noti:booking:reject:success"));
            setShow(false);
            mutate();
          })
          .catch((err) => {
            console.log(err);
            toast.error(t("noti:booking:reject:fail"));
          });
      }
    });
  };

  const AntTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      display: "none",
    },
  });

  const AntTab = styled((props: any) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      fontWeight: theme.typography.fontWeightRegular,
      margin: theme.spacing(1),
      padding: "8px 16px !important",
      color: "rgba(0, 0, 0, 0.85)",
      "&:hover": {
        color: "#40a9ff",
        opacity: 1,
      },
      "&.Mui-selected": {
        color: "#020873",
        background: "#E6E7F1",
        border: "1px solid #020873 !important",
        fontWeight: theme.typography.fontWeightMedium,
        borderRadius: "66px",
      },
    })
  );

  useEffect(() => {
    document.title = t("title:bookingApproval");
  }, []);

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
          <span className="mx-auto">{location.state.title}</span>
        </div>
        <Box sx={{ bgcolor: "#fff" }}>
          <AntTabs
            value={tabStatus}
            onChange={(_, newValue: number) => setTabStatus(newValue)}
          >
            <AntTab
              label={`${t("pending")} | ${location.state.totalpending}`}
            />
            <AntTab
              label={`${t("approved")} | ${location.state.totalapproved}`}
            />
            <AntTab label={`${t("cancelled")}`} />
          </AntTabs>
        </Box>
        <div className="bg-gray-100">
          <div className="py-1" />
          <div className="">
            {getReservByBusiId ? (
              getReservByBusiId?.map((item: any, index: number) => {
                const date = moment(item.date).format("DD");
                const day = moment(item.date).format("dddd");
                const month = moment(item.date).format("MMMM");
                return (
                  <div key={index} className="my-2">
                    <Accordion defaultExpanded={index === 0 ? true : false}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index + 1}-content`}
                        id={`panel${index + 1}-header`}
                      >
                        <span className="w-3/4">
                          {`${date} ${
                            monthsOfYearFullName(language)?.find(
                              (ii) => ii.value === month
                            )?.name ?? ""
                          }, ${
                            dayOfWeekFullName(language)?.find(
                              (ii) => ii.value === day
                            )?.name ?? ""
                          }`}
                        </span>
                        <span
                          className={`w-1/4 text-white text-center rounded-lg ${(() => {
                            switch (tabStatus) {
                              case 0:
                                return "bg-[#F0AD4E]";

                              case 1:
                                return "bg-green-500";
                            }
                          })()}`}
                        >
                          {item.children?.length}{" "}
                          {tabStatus == 0
                            ? t("pending")
                            : tabStatus == 1
                            ? t("approved")
                            : null}
                        </span>
                      </AccordionSummary>
                      <AccordionDetails>
                        {item.children.map((ii: any, jj: number) => {
                          return <RequestCards key={jj} data={ii} />;
                        })}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
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
