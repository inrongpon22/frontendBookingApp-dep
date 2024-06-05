import { currencyList, numbers } from "../../helper/currency";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Header from "./components/Header";
import { Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ConfirmCard from "../../components/dialog/ConfirmCard";
import { IServiceInfo } from "../../interfaces/services/Iservice";
import { ToggleButton as MuiToggleButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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
    const [isTypePrice, setIsTypePrice] = useState(false);
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
        price: Yup.string().required(
            t("formValidation:service:create:price:priceReq")
        ),
    });

    const formik = useFormik({
        initialValues: {
            serviceName: props.serviceInfo?.serviceName ?? "",
            serviceDescription: props.serviceInfo?.serviceDescription ?? "",
            currency:
                props.serviceInfo?.currency == undefined
                    ? "THB"
                    : props.serviceInfo.currency,
            price: props.serviceInfo?.price ?? "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values: IServiceInfo) => {
            if (props.isClose) {
                if (props.handleSetServiceInfo)
                    props.handleSetServiceInfo(values);
                if (props.handleClose) props.handleClose();
            } else {
                if (props.handleSetServiceInfo)
                    props.handleSetServiceInfo(values);
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
                formik.values.serviceDescription === "") ||
            (formik.values.serviceName === props.serviceInfo?.serviceName &&
                formik.values.serviceDescription ===
                    props.serviceInfo?.serviceDescription &&
                formik.values.price === props.serviceInfo?.price &&
                formik.values.currency === props.serviceInfo?.currency)
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
                    handleConfirm={() => navigate(-1)}
                />

                <div className="pr-4 pl-4 pt-6">
                    <Header
                        isClose={props.isClose}
                        context={t("addService")}
                        handleClose={
                            type !== null && type === "create" && !props.isClose
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
                                <div className="w-full flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                                    <div>
                                        <div className="text-[14px]">
                                            {t("title:setAPrice")}
                                        </div>
                                        <p className="text-[#6A6A6A] font-[12px]">
                                            {t("desc:desSetAPrice")}
                                        </p>
                                    </div>
                                    <MuiToggleButton
                                        value={isTypePrice}
                                        aria-label="Toggle switch"
                                        onClick={() =>
                                            setIsTypePrice(!isTypePrice)
                                        }
                                        sx={{
                                            width: 49,
                                            height: 28,
                                            borderRadius: 16,
                                            backgroundColor: isTypePrice
                                                ? "#020873"
                                                : "#ffffff",
                                            border: isTypePrice
                                                ? "1px solid #020873"
                                                : "1px solid  #9E9E9E",
                                            ":focus": { outline: "none" },
                                            ":hover": {
                                                backgroundColor: isTypePrice
                                                    ? "#020873"
                                                    : "#ffffff",
                                            },
                                        }}>
                                        <span
                                            style={{
                                                width: 23,
                                                height: 23,
                                                marginLeft: isTypePrice
                                                    ? ""
                                                    : "1px",
                                                marginRight: isTypePrice
                                                    ? "100px"
                                                    : " ",
                                                backgroundColor: isTypePrice
                                                    ? "#ffffff"
                                                    : "#9E9E9E",
                                                color: isTypePrice
                                                    ? "#020873"
                                                    : "#ffffff",
                                                borderRadius: "50%",
                                            }}
                                            className={`absolute left-0 rounded-full 
                                            shadow-md flex items-center justify-center transition-transform duration-300 ${
                                                isTypePrice
                                                    ? "transform translate-x-full"
                                                    : ""
                                            }`}>
                                            {isTypePrice ? (
                                                <CheckIcon
                                                    sx={{ fontSize: "14px" }}
                                                />
                                            ) : (
                                                <CloseIcon
                                                    sx={{ fontSize: "14px" }}
                                                />
                                            )}
                                        </span>
                                    </MuiToggleButton>
                                </div>
                            </div>
                            {isTypePrice && (
                                <div className="flex mt-3">
                                    <input
                                        name="price"
                                        type="text"
                                        className={`h-12 w-full px-4 border border-gray-300 rounded-lg rounded-r-none focus:outline-none ${
                                            formik.touched.price &&
                                            formik.errors.price
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder={t("fillPrice")}
                                        onKeyDown={() => setIsTyping(true)}
                                        onKeyUp={() => setIsTyping(false)}
                                    />
                                    {formik.values.price
                                        .split("")
                                        .some((char) =>
                                            numbers.includes(char)
                                        ) && (
                                        <select
                                            name="currency"
                                            className="border-l-0 h-12 border border-gray-300 rounded-r-lg px-2 focus:outline-none"
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
                                    )}
                                </div>
                            )}
                            {formik.touched.price && formik.errors.price ? (
                                <div className="text-red-500 text-sm mt-1">
                                    {formik.errors.price}
                                </div>
                            ) : null}

                            <div className="w-full flex justify-center fixed bottom-0 inset-x-0">
                                <button
                                    disabled={!formik.isValid}
                                    type="submit"
                                    className={`text-white mt-4 my-2 rounded-lg font-semibold w-[90vw] h-[51px] cursor-pointer text-[14px] ${
                                        !formik.isValid
                                            ? "bg-gray-300"
                                            : "bg-[#020873]"
                                    }`}>
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
