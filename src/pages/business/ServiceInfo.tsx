import { currencyList } from "../../helper/currency";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { IServiceInfo } from "./interfaces/service";
import Header from "./components/Header";
import { Divider, Drawer } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Anchor } from "../service/ServiceSetting";
import ServiceTime from "./ServiceTime";
import ConfirmCard from "../../components/dialog/ConfirmCard";

interface IProps {
    isClose: boolean;
    isEdit: boolean;
    handleClose?: (event: React.KeyboardEvent | React.MouseEvent) => void;
    handleCloseFromEdit?: () => void;
    serviceMutate?: () => void;
}

export default function ServiceInfo(props: IProps) {
    const { t } = useTranslation();
    const { businessId } = useParams();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const editValue = Boolean(urlParams.get("edit"));
    const serviceInfo = JSON.parse(
        localStorage.getItem("serviceInfo") || "{}"
    ) as IServiceInfo;
    const [isTyping, setIsTyping] = useState(false);
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [open, setOpen] = useState(false);

    const handleOpenConfirm = () => {
        setOpen(true);
    };
    const handleCloseConfirm = () => {
        setOpen(false);
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

    const addServiceTime = () => (
        <ServiceTime
            handleClose={() => setState({ ...state, ["right"]: false })}
            handleCloseServiceInFo={props.handleCloseFromEdit}
            serviceMutate={props.serviceMutate}
        />
    );

    const validationSchema = Yup.object().shape({
        serviceName: Yup.string().required(
            t("formValidation:service:create:serviceName:serviceNameReq")
        ),
        serviceDescription: Yup.string().required(
            t("formValidation:service:create:serviceDesc:serviceDescReq")
        ),
        price: Yup.number()
            .required(t("formValidation:service:create:price:priceReq"))
            .min(0, t("formValidation:service:create:price:priceReq")),
    });

    const formik = useFormik({
        initialValues: {
            serviceName: serviceInfo.serviceName ?? "",
            serviceDescription: serviceInfo.serviceDescription ?? "",
            currency:
                serviceInfo.currency == undefined
                    ? "THB"
                    : serviceInfo.currency,
            price: serviceInfo.price ?? "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values: IServiceInfo) => {
            // Handle form submission here
            const valueInString = JSON.stringify(values);
            localStorage.setItem("serviceInfo", valueInString);
            if (props.isClose) {
                if (props.isEdit) {
                    if (props.handleCloseFromEdit) props.handleCloseFromEdit();
                } else {
                    setState({ ...state, ["right"]: true });
                }
            } else {
                if (editValue) navigate(-1);
                else navigate(`/serviceTime/${businessId}`);
            }
        },
    });

    const handleOnClose = () => {
        if (
            !isTyping &&
            formik.values.serviceName === "" &&
            formik.values.serviceDescription === ""
        ) {
            if (props.isClose) {
                if (props.handleCloseFromEdit) props.handleCloseFromEdit();
            } else {
                navigate(-1);
            }
        } else {
            handleOpenConfirm();
        }
    };

    const handleCloseFrom = () => {
        if (props.handleCloseFromEdit) {
            props.handleCloseFromEdit();
            handleCloseConfirm();
            localStorage.removeItem("serviceInfo");
            localStorage.removeItem("serviceTime");
        }
    };

    return (
        <div>
            <ConfirmCard
                open={open}
                title={t("title:discardChanges")}
                description={t("desc:discardChanges")}
                bntConfirm={t("button:discard")}
                bntBack={t("button:back")}
                handleClose={handleCloseConfirm}
                handleConfirm={handleCloseFrom}
            />
            <Drawer
                anchor={"right"}
                open={state["right"]}
                onClose={toggleDrawer("right", false)}>
                {addServiceTime()}
            </Drawer>
            <div className="pr-4 pl-4 pt-6">
                <Header
                    context={"เพิ่มบริการใหม่"}
                    isClose={props.isClose}
                    handleClose={handleOnClose}
                    isTyping={isTyping}
                />
            </div>
            <Divider sx={{ marginTop: "16px", width: "100%" }} />
            <div className="flex flex-col pr-4 pl-4">
                <div className="flex flex-col">
                    <form onSubmit={formik.handleSubmit}>
                        <p
                            style={{ fontSize: "14px" }}
                            className="mt-4 font-semibold">
                            {t("serviceDesc")}
                        </p>
                        <input
                            value={formik.values.serviceName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            onKeyDown={() => setIsTyping(true)}
                            onKeyUp={() => setIsTyping(false)}
                            type="text"
                            name="serviceName"
                            style={{ color: "#8B8B8B" }}
                            placeholder={t("placeholder:serviceName")}
                            className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none`}
                        />
                        {formik.touched.serviceName &&
                        formik.errors.serviceName ? (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.serviceName}
                            </div>
                        ) : null}

                        <p
                            style={{ fontSize: "14px" }}
                            className="mt-3 font-semibold">
                            {t("serviceDesc")}
                        </p>
                        <input
                            type="text"
                            name="serviceDescription"
                            onKeyDown={() => setIsTyping(true)}
                            onKeyUp={() => setIsTyping(false)}
                            style={{ color: "#8B8B8B" }}
                            placeholder={t("placeholder:serviceDesc")}
                            className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${
                                formik.touched.serviceDescription &&
                                formik.errors.serviceDescription
                                    ? "border-red-500"
                                    : ""
                            }`}
                            value={formik.values.serviceDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            maxLength={100}
                        />
                        {formik.touched.serviceDescription &&
                        formik.errors.serviceDescription ? (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.serviceDescription}
                            </div>
                        ) : null}

                        <p
                            style={{ fontSize: "14px" }}
                            className="mt-3 font-semibold">
                            {t("price")}
                        </p>
                        <div className="flex items-center">
                            <select
                                name="currency"
                                className="border-r-0 h-12 border border-gray-300 rounded-l-lg px-2 focus:outline-none"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.currency}>
                                {currencyList.map((item, index) => (
                                    <option key={index} value={item.code}>
                                        {item.code}
                                    </option>
                                ))}
                            </select>
                            <input
                                style={{ textAlign: "right" }}
                                name="price"
                                type="number"
                                className={`h-12 w-full px-4 border border-gray-300 rounded-r-lg focus:outline-none ${
                                    formik.touched.price && formik.errors.price
                                        ? "border-red-500"
                                        : ""
                                }`}
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="0"
                                onKeyDown={() => setIsTyping(true)}
                                onKeyUp={() => setIsTyping(false)}
                            />
                        </div>
                        {formik.touched.price && formik.errors.price ? (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.price}
                            </div>
                        ) : null}

                        <div className="w-full flex justify-center fixed bottom-0 inset-x-0 mt-8">
                            <button
                                type="submit"
                                className="text-white mt-4 rounded-lg font-semibold mb-6"
                                style={{
                                    width: "343px",
                                    height: "51px",
                                    cursor: "pointer",
                                    backgroundColor: "#020873",
                                    fontSize: "14px",
                                }}>
                                {t("button:next")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
