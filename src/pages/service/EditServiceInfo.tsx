import { Divider } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { currencyList } from "../../helper/currency";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import { IServiceInfo } from "../../interfaces/services/Iservice";
import { useState } from "react";
import ConfirmCard from "../../components/dialog/ConfirmCard";

interface IParams {
    serviceName: string;
    serviceDescription: string;
    price: number;
    currency: string;
    handleSetEditInfo: () => void;
    serviceMutate: () => void;
    handleSetServiceInfo?: (serviceInFo: IServiceInfo) => void;
}

const validationSchema = Yup.object().shape({
    serviceName: Yup.string().required(
        t("formValidation:service:create:serviceName:serviceNameReq")
    ),
    serviceDescription: Yup.string().required(
        t("formValidation:service:create:serviceDesc:serviceDescReq")
    ),
    price: Yup.number()
        .required(t("formValidation:service:create:price:priceReq"))
        .min(0, t("formValidation:service:create:price:priceMin")),
});

export default function EditServiceInfo(props: IParams) {
    const { t } = useTranslation();
    const [openConfirm, setOpenConfirm] = useState(false);

    const formik = useFormik({
        initialValues: {
            serviceName: props.serviceName ?? "",
            serviceDescription: props.serviceDescription ?? "",
            currency: props.currency == undefined ? "THB" : props.currency,
            price: props.price,
        },
        validationSchema: validationSchema,
        onSubmit: async (values: IServiceInfo) => {
            if (props.handleSetServiceInfo) {
                props.handleSetServiceInfo(values);
            } else {
                const valueInString = JSON.stringify(values);
                localStorage.setItem("serviceInfo", valueInString);
            }
            props.serviceMutate();
            props.handleSetEditInfo();
        },
    });

    const handleIsModifiedData = () => {
        return (
            props.serviceName !== formik.values.serviceName ||
            props.serviceDescription !== formik.values.serviceDescription ||
            props.price !== formik.values.price
        );
    };

    const handleCloseFromEdit = () => {
        if (!handleIsModifiedData()) {
            props.handleSetEditInfo();
        } else {
            setOpenConfirm(true);
        }
    };

    return (
        <div
            className={`w-full sm:w-auto md:w-full lg:w-auto xl:w-full overflow-x-hidden`}
            style={{ width: "100vw" }}>
            <ConfirmCard
                open={openConfirm}
                title={t("title:discardChanges")}
                description={t("desc:discardChanges")}
                bntConfirm={t("button:discard")}
                bntBack={t("button:back")}
                handleClose={() => setOpenConfirm(false)}
                handleConfirm={props.handleSetEditInfo}
            />
            <div className="pr-4 pl-4 pt-6">
                <div className="flex items-center justify-between">
                    <div onClick={handleCloseFromEdit}>
                        <CloseIcon
                            sx={{
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                            }}
                        />
                    </div>

                    <div className="font-bold" style={{ fontSize: "14px" }}>
                        {t("title:serviceInformation")}
                    </div>

                    <div>
                        <div style={{ width: "20px", height: "20px" }} />
                    </div>
                </div>
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
                            type="text"
                            name="serviceName"
                            style={{ color: "#000000" }}
                            placeholder={t(
                                "formValidation:service:create:serviceName:serviceNameFill"
                            )}
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
                            style={{ color: "#000000" }}
                            placeholder={t(
                                "formValidation:service:create:serviceDesc:serviceDescFill"
                            )}
                            className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${formik.touched.serviceDescription &&
                                formik.errors.serviceDescription
                                ? "border-red-500"
                                : ""
                                }`}
                            value={formik.values.serviceDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
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
                                className={`h-12 w-full px-4 border border-gray-300 rounded-r-lg focus:outline-none ${formik.touched.price && formik.errors.price
                                    ? "border-red-500"
                                    : ""
                                    }`}
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.price && formik.errors.price ? (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.price}
                            </div>
                        ) : null}

                        <div className="w-full flex justify-center bottom-0 inset-x-0 absolute">
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
