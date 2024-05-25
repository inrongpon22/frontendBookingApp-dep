import { currencyList } from "../../helper/currency";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Header from "./components/Header";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ConfirmCard from "../../components/dialog/ConfirmCard";
import { IServiceInfo } from "../../interfaces/services/Iservice";

interface IProps {
    isClose: boolean;
    isEdit: boolean;
    serviceInfo?: IServiceInfo;
    handleClose?: () => void;
    serviceMutate?: () => void;
    handleAddTime?: () => void;
    handleSetServiceInfo?: (value: IServiceInfo) => void;
}

export default function AddServiceInfo(props: IProps) {
    const { t } = useTranslation();
    const { businessId } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    const navigate = useNavigate();
    // const serviceInfo = JSON.parse(
    //     localStorage.getItem("serviceInfo") || "{}"
    // ) as IServiceInfo;
    const [isTyping, setIsTyping] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpenConfirm = () => {
        setOpen(true);
    };
    const handleCloseConfirm = () => {
        setOpen(false);
    };

    const validationSchema = Yup.object().shape({
        serviceName: Yup.string().required(
            t("formValidation:service:create:serviceName:serviceNameReq")
        ),
        price: Yup.number()
            .required(t("formValidation:service:create:price:priceReq"))
            .min(0, t("formValidation:service:create:price:priceReq")),
    });

    const formik = useFormik({
        initialValues: {
            serviceName: props.serviceInfo?.serviceName ?? "",
            serviceDescription: props.serviceInfo?.serviceDescription ?? "",
            currency:
                props.serviceInfo?.currency == undefined
                    ? "THB"
                    : props.serviceInfo.currency,
            price: props.serviceInfo?.price ?? 0,
        },
        validationSchema: validationSchema,
        onSubmit: async (values: IServiceInfo) => {
            if (props.isClose) {
                if (props.handleSetServiceInfo) props.handleSetServiceInfo(values);
                if (props.handleClose) props.handleClose();
            } else {
                if (props.handleSetServiceInfo) props.handleSetServiceInfo(values);
                if (props.handleAddTime) {
                    props.handleAddTime();
                }
                if (props.handleClose) props.handleClose();
            }

        },
    });

    const handleOnClose = () => {
        if (
            (!isTyping &&
                formik.values.serviceName === "" &&
                formik.values.serviceDescription === "") || (
                formik.values.serviceName === props.serviceInfo?.serviceName &&
                formik.values.serviceDescription === props.serviceInfo?.serviceDescription &&
                formik.values.price === props.serviceInfo?.price &&
                formik.values.currency === props.serviceInfo?.currency
            )
        ) {
            if (props.isClose) {
                if (props.handleClose) props.handleClose();
            } else {
                navigate(-1);
            }
        } else {
            handleOpenConfirm();
        }
    };

    const handleCloseFrom = () => {
        handleCloseConfirm();
    };

    return (
        <div>
            <>
                <ConfirmCard
                    open={open}
                    title={t("title:discardChanges")}
                    description={t("desc:discardChanges")}
                    bntConfirm={t("button:discard")}
                    bntBack={t("button:back")}
                    handleClose={handleCloseConfirm}
                    handleConfirm={handleCloseFrom}
                />

                <div className="pr-4 pl-4 pt-6">
                    <Header
                        isClose={props.isClose}
                        context={t("addService")}
                        handleClose={
                            (type !== null && type === "create" && !props.isClose)
                                ? () =>
                                    navigate(
                                        `/create-business?businessId=${businessId}`
                                    )
                                : handleOnClose
                        }
                    />
                </div>
                <Divider sx={{ marginTop: "16px", width: "100%" }} />
                <div className="flex flex-col pr-4 pl-4">
                    <div className="flex flex-col">
                        <form onSubmit={formik.handleSubmit}>
                            <p
                                style={{ fontSize: "14px" }}
                                className="mt-4 font-semibold">
                                {t("serviceName")}
                            </p>
                            <input
                                value={formik.values.serviceName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                onKeyDown={() => setIsTyping(true)}
                                onKeyUp={() => setIsTyping(false)}
                                type="text"
                                name="serviceName"
                                style={{ color: "#000000" }}
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
                                style={{ color: "#000000" }}
                                placeholder={t("placeholder:serviceDesc")}
                                className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none `}
                                value={formik.values.serviceDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                maxLength={100}
                            />

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
                                        <option
                                            key={index}
                                            value={item.code}>
                                            {item.code}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    style={{ textAlign: "right" }}
                                    name="price"
                                    type="number"
                                    className={`h-12 w-full px-4 border border-gray-300 rounded-r-lg focus:outline-none ${formik.touched.price &&
                                        formik.errors.price
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                    value={formik.values.price == 0 ? "" : formik.values.price}
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

                            <div className="w-full flex justify-center fixed bottom-0 inset-x-0">
                                <button
                                    type="submit"
                                    className="text-white mt-4 my-3 rounded-lg font-semibold w-[90vw] h-[51px] bg-[#020873] cursor-pointer text-[14px]"
                                >
                                    {t("button:next")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        </div>
    );
}
