import { Box, Drawer, alpha } from "@mui/material";
import ServiceCard from "./components/ServiceCard";
import TimeCard from "./components/TimeCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { addService } from "../../api/service";
import Header from "./components/Header";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToggleButton as MuiToggleButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Anchor } from "../service/ServiceSetting";
import BusinessPreview from "../service/BusinessPreview";
import { IServiceInfo, IServiceTime } from "../../interfaces/services/Iservice";
import EditServiceInfo from "../service/EditServiceInfo";
import EditServiceTime from "../service/EditServiceTime";
import AddServiceTime from "../service/AddServiceTime";
import Loading from "../../components/dialog/Loading";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
// import CreateSuccessful from "../service/CreateSuccessful";

interface IProps {
    handleClose?: () => void;
    handleAddData?: () => void;
    handleEdit?: (index: number) => void;
    handleCloseServiceInFo?: () => void;
    handleCloseServiceTime?: () => void;
    serviceMutate?: () => void;
    serviceId?: number;
}

export default function CreateService(props: IProps) {
    const { businessId } = useParams();
    const { data: businessData } = useSWR<any>(
        businessId && `${app_api}/business/${businessId}`,
        fetcher
    );
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams(location.search);
    const step = queryParams.get("step");
    const { t } = useTranslation();
    const serviceInfo = JSON.parse(
        localStorage.getItem("serviceInfo") || "{}"
    ) as IServiceInfo;
    // const [modifyServiceInfo, setModifyServiceInfo] = useState<IServiceInfo>();

    const [isHideEndTime, setIsHideEndTime] = useState(false);

    const [isAutoApprove, setIsAutoApprove] = useState(false);
    const [isHidePrice, setIsHidePrice] = useState(false);
    const [serviceTime, setServiceTime] = useState<IServiceTime[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAddTime, setIsAddTime] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    useEffect(() => {
        const serviceTime = JSON.parse(
            localStorage.getItem("serviceTime") || "[]"
        ) as IServiceTime[];
        setServiceTime(serviceTime);
    }, [refresh]);

    const handleCreateService = async () => {
        const insertData = {
            businessId: Number(businessId ?? ""),
            title: serviceInfo.serviceName,
            // duration: serviceTime[0].duration,
            description: serviceInfo.serviceDescription,
            price: serviceInfo.price,
            isAutoApprove: isAutoApprove,
            currency: serviceInfo.currency,
            openTime: businessData?.openTime.substring(0, 5),
            closeTime: businessData?.closeTime.substring(0, 5),
            // bookingSlots: [
            //     {
            //         daysOpen: serviceTime[0].daysOpen,
            //         availableFromDate: serviceTime[0].availableFromDate,
            //         availableToDate:
            //             serviceTime[0].availableToDate === ""
            //                 ? null
            //                 : serviceTime[0].availableToDate,
            //         slotsTime: serviceTime[0].slotsTime,
            //         duration: serviceTime[0].duration,
            //     },
            // ],
            bookingSlots: serviceTime.map((time) => ({
                daysOpen: time.daysOpen,
                availableFromDate: time.availableFromDate,
                availableToDate:
                    time.availableToDate === "" ? null : time.availableToDate,
                slotsTime: time.slotsTime,
                duration: time.duration,
            })),
            availableFromDate: serviceTime[0].availableFromDate,
            availableToDate:
                serviceTime[0].availableToDate === ""
                    ? null
                    : serviceTime[0].availableToDate,
            isHidePrice: isHidePrice,
            isHideEndTime: isHideEndTime,
        };

        console.log("insertData", insertData);

        try {
            if (token === null) throw new Error("Token is not found");
            // setIsLoading(true);
            await addService(insertData, token).then(() => {
                props.serviceMutate && props.serviceMutate();
                localStorage.removeItem("serviceInfo");
                localStorage.removeItem("serviceTime");
                props.handleCloseServiceInFo && props.handleCloseServiceInFo();
                props.handleCloseServiceTime && props.handleCloseServiceTime();
                setIsLoading(false);
                if (step === "1" && step !== null) {
                    navigate(`/create-successful/${businessId}`);
                } else {
                    navigate(`/service-setting/${businessId}`);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // const handleAddTime = () => {
    //     if (props.handleClose) {
    //         props.handleClose();
    //     }
    //     if (props.handleAddData) props.handleAddData();
    // };

    const handleDelete = (index: number) => {
        const newServiceTime = [...serviceTime];
        newServiceTime.splice(index, 1);
        localStorage.setItem("serviceTime", JSON.stringify(newServiceTime));
        if (newServiceTime.length === 0) {
            localStorage.removeItem("serviceTime");
        }
        setRefresh(!refresh);
    };

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setState({ ...state, [anchor]: open });
        };

    const editService = () => (
        <Box sx={{ height: "100vh" }}>
            <EditServiceInfo
                serviceName={serviceInfo.serviceName}
                serviceDescription={serviceInfo.serviceDescription}
                price={serviceInfo.price}
                currency={serviceInfo.currency}
                handleSetEditInfo={() =>
                    setState({ ...state, ["bottom"]: false })
                }
                serviceMutate={props.serviceMutate || (() => {})}
            />
        </Box>
    );

    const previewService = () => (
        <Box sx={{ height: "100vh" }}>
            {/* <CreateSuccessful openLoading={true} /> */}
            {serviceTime.length > 0 && (
                <BusinessPreview
                    businessId={Number(businessId)}
                    title={serviceInfo.serviceName}
                    description={serviceInfo.serviceDescription}
                    price={serviceInfo.price}
                    isAutoApprove={isAutoApprove}
                    currency={serviceInfo.currency}
                    bookingSlots={serviceTime.map((time) => ({
                        daysOpen: time.daysOpen,
                        availableFromDate: time.availableFromDate,
                        availableToDate: time.availableToDate,
                        slotsTime: time.slotsTime,
                    }))}
                    availableFromDate={""}
                    availableToDate={""}
                    isHidePrice={isHidePrice}
                    isHideEndTime={isHideEndTime}
                    handleClose={() => setState({ ...state, bottom: false })}
                />
            )}
        </Box>
    );
    const editServiceTime = () => (
        <Box sx={{ height: "100vh" }}>
            {serviceTime.length > 0 &&
                (isAddTime ? (
                    <AddServiceTime
                        serviceTime={serviceTime}
                        handleCloseCard={() => {
                            setState({ ...state, ["bottom"]: false });
                            setIsAddTime(false);
                        }}
                    />
                ) : (
                    <EditServiceTime
                        serviceTime={serviceTime}
                        openTime={businessData?.openTime}
                        closeTime={businessData?.closeTime}
                        editIndex={selectedIndex}
                        isAddTime={isAddTime}
                        handleSetEditTime={() =>
                            setState({ ...state, ["bottom"]: false })
                        }
                    />
                ))}
        </Box>
    );

    const [typeName, setTypeName] = useState("");

    const handleEditService = () => {
        setTypeName("service");
        setState({ ...state, ["bottom"]: true });
    };

    const handlePreview = () => {
        setTypeName("preview");
        setState({ ...state, ["bottom"]: true });
    };

    const handleEditServiceTime = (index: number) => {
        setTypeName("serviceTime");
        setState({ ...state, ["bottom"]: true });
        setSelectedIndex(index);
        setRefresh(!refresh);
    };

    const handleAddServiceTime = () => {
        setTypeName("serviceTime");
        setState({ ...state, ["bottom"]: true });
        setIsAddTime(true);
        props.handleAddData && props.handleAddData();
        setRefresh(!refresh);
    };

    return (
        <div
            className={`w-full sm:w-auto md:w-full lg:w-auto xl:w-full overflow-x-hidden`}
            style={{ width: "100vw" }}>
            <Loading openLoading={isLoading} />
            {typeName == "service" ? (
                <Drawer
                    anchor={"bottom"}
                    open={state["bottom"]}
                    onClose={toggleDrawer("bottom", false)}>
                    {editService()}
                </Drawer>
            ) : typeName == "preview" ? (
                <Drawer
                    anchor={"bottom"}
                    open={state["bottom"]}
                    onClose={toggleDrawer("bottom", false)}>
                    {previewService()}
                </Drawer>
            ) : (
                <Drawer
                    anchor={"bottom"}
                    open={state["bottom"]}
                    onClose={toggleDrawer("bottom", false)}>
                    {editServiceTime()}
                </Drawer>
            )}

            <div className="pr-4 pl-4 pt-6">
                <Header
                    context={t("title:serviceInformation")}
                    isClose={false}
                    handleClose={props.handleClose}
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                <div
                    style={{ marginBottom: "20px" }}
                    className="mt-4 flex flex-col gap-3">
                    <ServiceCard handleEdit={handleEditService} />
                    {serviceTime &&
                        serviceTime.map((time, index) => (
                            <div
                                // onClick={() =>
                                //     props.handleEdit && props.handleEdit(index)
                                // }
                                // onClick={() => handleEditServiceTime(index)}
                                key={index}>
                                <TimeCard
                                    index={index}
                                    serviceTime={time}
                                    handleDelete={handleDelete}
                                    handleEditServiceTime={
                                        handleEditServiceTime
                                    }
                                />
                            </div>
                        ))}

                    <button
                        onClick={handleAddServiceTime}
                        style={{
                            display: "flex",
                            background: `${alpha("#020873", 0.1)}`,
                            width: "135px",
                            height: "27px",
                            fontSize: "14px",
                            borderRadius: "8px",
                            textAlign: "center",
                            justifyContent: "center",
                            color: "#020873",
                        }}
                        className=" items-center gap-1 p-1 ">
                        <AddCircleOutlineIcon sx={{ fontSize: "13px" }} />
                        {t("button:addServiceTime")}
                    </button>

                    <p className=" font-bold " style={{ fontSize: "14px" }}>
                        {t("serviceSetting")}
                    </p>

                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div className="w-[60vw]">
                            <div className="text-[14px]">
                                {t("isAutoApprove")}
                            </div>
                            <p className="text-[#6A6A6A] font-[12px]">
                                {t("desc:autoApprove")}
                            </p>
                        </div>
                        <MuiToggleButton
                            value={isAutoApprove}
                            aria-label="Toggle switch"
                            onClick={() => setIsAutoApprove(!isAutoApprove)}
                            sx={{
                                width: 49,
                                height: 28,
                                borderRadius: 16,
                                backgroundColor: isAutoApprove
                                    ? "#020873"
                                    : "#ffffff",
                                border: isAutoApprove
                                    ? "2px solid #020873"
                                    : "2px solid  #9E9E9E",
                                ":focus": { outline: "none" },
                                ":hover": {
                                    backgroundColor: isAutoApprove
                                        ? "#020873"
                                        : "#ffffff",
                                },
                            }}>
                            <span
                                style={{
                                    width: 23,
                                    height: 23,
                                    marginLeft: isAutoApprove ? "" : "1px",
                                    marginRight: isAutoApprove ? "100px" : " ",
                                    backgroundColor: isAutoApprove
                                        ? "#ffffff"
                                        : "#9E9E9E",
                                    color: isAutoApprove
                                        ? "#020873"
                                        : "#ffffff",
                                    borderRadius: "50%",
                                }}
                                className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${
                                    isAutoApprove
                                        ? "transform translate-x-full"
                                        : ""
                                }`}>
                                {isAutoApprove ? (
                                    <CheckIcon sx={{ fontSize: "14px" }} />
                                ) : (
                                    <CloseIcon sx={{ fontSize: "14px" }} />
                                )}
                            </span>
                        </MuiToggleButton>
                    </div>
                    {/* <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>{t("isHideServPrice")}</div>
                        <MuiToggleButton
                            value={isHidePrice}
                            aria-label="Toggle switch"
                            onClick={() => setIsHidePrice(!isHidePrice)}
                            sx={{
                                width: 49,
                                height: 28,
                                borderRadius: 16,
                                backgroundColor: isHidePrice
                                    ? "#020873"
                                    : "#ffffff",
                                border: isHidePrice
                                    ? "2px solid #020873"
                                    : "2px solid  #9E9E9E",
                                ":focus": { outline: "none" },
                                ":hover": {
                                    backgroundColor: isHidePrice
                                        ? "#020873"
                                        : "#ffffff",
                                },
                            }}>
                            <span
                                style={{
                                    width: 23,
                                    height: 23,
                                    marginLeft: isHidePrice ? "" : "1px",
                                    marginRight: isHidePrice ? "100px" : " ",
                                    backgroundColor: isHidePrice
                                        ? "#ffffff"
                                        : "#9E9E9E",
                                    color: isHidePrice ? "#020873" : "#ffffff",
                                    borderRadius: "50%",
                                }}
                                className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${
                                    isHidePrice
                                        ? "transform translate-x-full"
                                        : ""
                                }`}>
                                {isHidePrice ? (
                                    <CheckIcon sx={{ fontSize: "14px" }} />
                                ) : (
                                    <CloseIcon sx={{ fontSize: "14px" }} />
                                )}
                            </span>
                        </MuiToggleButton>
                    </div>

                    <div
                        style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                        className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                        <div>{t("isHideEndDate")}</div>
                        <MuiToggleButton
                            value={isHideEndTime}
                            aria-label="Toggle switch"
                            onChange={() => setIsHideEndTime(!isHideEndTime)}
                            sx={{
                                width: 49,
                                height: 28,
                                borderRadius: 16,
                                backgroundColor: isHideEndTime
                                    ? "#020873"
                                    : "#ffffff",
                                border: isHideEndTime
                                    ? "2px solid #020873"
                                    : "2px solid  #9E9E9E",
                                ":focus": { outline: "none" },
                                ":hover": {
                                    backgroundColor: isHideEndTime
                                        ? "#020873"
                                        : "#ffffff",
                                },
                            }}>
                            <span
                                style={{
                                    width: 23,
                                    height: 23,
                                    marginLeft: isHideEndTime ? "" : "1px",
                                    marginRight: isHideEndTime ? "100px" : " ",
                                    backgroundColor: isHideEndTime
                                        ? "#ffffff"
                                        : "#9E9E9E",
                                    color: isHideEndTime
                                        ? "#020873"
                                        : "#ffffff",
                                    borderRadius: "50%",
                                }}
                                className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${
                                    isHideEndTime
                                        ? "transform translate-x-full"
                                        : ""
                                }`}>
                                {isHideEndTime ? (
                                    <CheckIcon sx={{ fontSize: "14px" }} />
                                ) : (
                                    <CloseIcon sx={{ fontSize: "14px" }} />
                                )}
                            </span>
                        </MuiToggleButton>
                    </div> */}

                    <div
                        className="w-full flex justify-center bottom-0 inset-y-0 gap-2"
                        style={{
                            marginTop: serviceTime.length > 0 ? 0 : "100px",
                        }}>
                        <button
                            className="border text-white mt-4 rounded-lg font-semibold"
                            style={{
                                borderColor: `${alpha("#000000", 0.2)}`,
                                color: "black",
                                width: "166px",
                                height: "51px",
                                cursor: "pointer",
                                backgroundColor: "white",
                                fontSize: "14px",
                            }}
                            onClick={handlePreview}>
                            {t("button:preview")}
                        </button>
                        <button
                            onClick={handleCreateService}
                            type="submit"
                            className="text-white mt-4 rounded-lg font-semibold"
                            style={{
                                width: "166px",
                                height: "51px",
                                cursor: "pointer",
                                backgroundColor: "#020873",
                                fontSize: "14px",
                            }}>
                            {t("button:confirm")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
