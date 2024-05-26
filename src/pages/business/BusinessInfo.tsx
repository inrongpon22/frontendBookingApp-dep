// import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchMap from "./SearchMap";
import { dayOfWeek } from "../../helper/daysOfWeek";
import { insertBusiness, updateBusiness } from "../../api/business";
import { useTranslation } from "react-i18next";
import moment from "moment";
import useSWR from "swr";
import { app_api, fetcher } from "../../helper/url";
import { GlobalContext } from "../../contexts/BusinessContext";
import { getUserIdByAccessToken } from "../../api/user";
import toast from "react-hot-toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ILocation } from "../../interfaces/business";
import { supabase } from "../../helper/createSupabase";
import InsertImages from "./components/InsertImages";
import { generateUniqueRandomNumber } from "../../helper/generateRandomNumber";
import Loading from "../../components/dialog/Loading";

export default function BusinessInfo() {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get("businessId");
    const action = queryParams.get("action");
    const [files, setFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const { setShowDialog } = useContext(GlobalContext);
    const {
        t,
        i18n: { language },
    } = useTranslation();

    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const { data: businessData } = useSWR(
        businessId && `${app_api}/business/${businessId ?? ""}`,
        fetcher
    );
    const [locationData, setLocationData] = useState<ILocation>({
        lat: 0,
        lng: 0,
        address: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const [daysOpen, setDaysOpen] = useState<string[]>([]);
    const schema = Yup.object().shape({
        title: Yup.string()
            .min(2, t("formValidation:business:create:shopName:shopNameMin"))
            .max(50, t("formValidation:business:create:shopName:shopNameMax"))
            .required(t("formValidation:business:create:shopName:shopNameReq")),
        daysOpen: Yup.array()
            .of(
                Yup.string().required(
                    t("formValidation:business:create:daysOpen:req")
                )
            )
            .min(1, t("formValidation:business:create:daysOpen:req"))
            .required(t("formValidation:business:create:daysOpen:req")),
        openTime: Yup.string().required(
            t("formValidation:business:create:openTime:req")
        ),
        closeTime: Yup.string()
            .required(t("formValidation:business:create:closeTime:req"))
            .test(
                "is-greater",
                t("formValidation:business:create:closeTime:moreThanOpenTime"),
                function (value) {
                    const { openTime } = this.parent;
                    return moment(value, "HH:mm").isAfter(
                        moment(openTime, "HH:mm")
                    );
                }
            ),
        phoneNumber: Yup.string()
            .matches(
                /^[0-9]+$/,
                t("formValidation:business:create:phoneNumber:phoneNumberMatch")
            )
            .min(
                10,
                t("formValidation:business:create:phoneNumber:phoneNumberMin")
            )
            .max(
                10,
                t("formValidation:business:create:phoneNumber:phoneNumberMax")
            )
            .required(
                t("formValidation:business:create:phoneNumber:phoneNumberReq")
            ),
        location: Yup.string().required(
            t("formValidation:business:create:location:locationReq")
        ),
        description: Yup.string().max(
            200,
            t("formValidation:business:create:description:descriptionMax")
        ),
    });

    useEffect(() => {
        if (businessData) {
            setLocationData({
                lat: businessData.latitude || 0,
                lng: businessData.longitude || 0,
                address: businessData.address || "",
            });
            const fetchImageUrls = async () => {
                try {
                    const arrayImageUrls: string[] = [];
                    if (businessData) {
                        const imageUrls = await Promise.all(
                            businessData.imagesURL.map(async (element: string) => {
                                const { data } = supabase.storage
                                    .from("BookingSystem/images/")
                                    .getPublicUrl(element);
                                return data;
                            })
                        );

                        imageUrls.forEach((element) => {
                            if (!arrayImageUrls.includes(element.publicUrl)) {
                                arrayImageUrls.push(element.publicUrl);
                            }
                        });
                        setPreviewImages(arrayImageUrls);
                    }
                } catch (error) {
                    console.error("Error fetching image URLs:", error);
                }
            };
            fetchImageUrls();
            setDaysOpen(businessData.daysOpen || []);
            formik.setFieldValue("title", businessData.title);
            formik.setFieldValue("openTime", businessData.openTime);
            formik.setFieldValue("closeTime", businessData.closeTime);
            formik.setFieldValue("phoneNumber", businessData.phoneNumber);
            formik.setFieldValue("description", businessData.description);
            formik.setFieldValue("location", businessData.address);
            formik.setFieldValue("daysOpen", businessData.daysOpen);
            handleChangeLocation({
                lat: businessData.latitude,
                lng: businessData.longitude,
                address: businessData.address,
            });
            formik.isValid = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessData]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileReader = new FileReader();
            const newFile = e.target.files ? e.target.files[0] : null;
            if (newFile) {
                fileReader.onload = () => {
                    const previewURL = fileReader.result as string;
                    setPreviewImages((pre) => {
                        return [...pre, previewURL];
                    });
                };

                fileReader.readAsDataURL(newFile);
            }

            setFiles((prevFiles) => {
                if (newFile) {
                    return [...prevFiles, newFile];
                } else {
                    return prevFiles;
                }
            });
        }
    };

    const handleClearImages = (index: number) => {
        setPreviewImages((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
        setFiles((prevFiles) => {
            const newImages = [...prevFiles];
            newImages.splice(index, 1);
            return newImages;
        });
        businessData?.imagesURL?.splice(index, 1);
    };

    const handleChangeLocation = (inputData: ILocation) => {
        formik.setFieldValue("location", inputData.address);
        setLocationData(inputData);
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            daysOpen: [],
            openTime: "",
            closeTime: "",
            phoneNumber: "",
            location: "",
            description: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            const userId = await getUserIdByAccessToken(accessToken ?? "", token ?? "");
            if (token === null) {
                throw new Error("Token is not found");
            }

            if (businessId) {
                const imagesURL: string[] = [];
                const uniqueRandomNumber = generateUniqueRandomNumber();
                if (files.length > 0) {
                    for (const element of files) {
                        const { data, error } = await supabase.storage
                            .from("BookingSystem/images")
                            .upload(
                                files !== null
                                    ? element.name + `${uniqueRandomNumber}`
                                    : "",
                                element
                            );
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(data.path);
                            imagesURL.push(data.path);
                        }
                    }
                }

                const updateData = {
                    title: values.title,
                    imagesURL: imagesURL.concat(
                        businessData?.imagesURL || []
                    ),
                    description: values.description,
                    phoneNumber: values.phoneNumber,
                    address: locationData.address,
                    latitude: locationData.lat,
                    longitude: locationData.lng,
                    daysOpen: daysOpen,
                    openTime: values.openTime,
                    closeTime: values.closeTime,
                    userId: userId ? Number(userId) : 0,
                };
                const business = await updateBusiness(
                    updateData,
                    Number(businessId),
                    token
                );
                setShowDialog(false);
                setIsLoading(true);
                if (action === "edit" && action) {
                    toast(t("editSuccess"), {
                        icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                    });
                    navigate(`/business-profile/${business.data.businessId}`);
                } else {
                    toast(t("addBusiness"), {
                        icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                    });
                    navigate(`/service/${business.data.businessId}?type=create`);
                }
                setIsLoading(false);

            } else {
                const insertData = {
                    title: values.title,
                    imagesURL: [],
                    description: values.description,
                    phoneNumber: values.phoneNumber,
                    address: locationData.address,
                    latitude: locationData.lat,
                    longitude: locationData.lng,
                    daysOpen: daysOpen,
                    openTime: values.openTime,
                    closeTime: values.closeTime,
                    userId: userId ? Number(userId) : 0,
                };
                const business = await insertBusiness(insertData, token);
                setShowDialog(false);
                setIsLoading(true);
                toast(t("addBusiness"), {
                    icon: <CheckCircleOutlineIcon sx={{ color: "green" }} />,
                });
                navigate(`/service/${business.data.businessId}?type=create`);
                setIsLoading(false);
            }
        },
    });

    const isDaySelected = (dayValue: string) => {
        return daysOpen.includes(dayValue);
    };

    const toggleDay = (dayValue: string) => {
        if (isDaySelected(dayValue)) {
            setDaysOpen(daysOpen.filter((day) => day !== dayValue));
            formik.setFieldValue(
                "daysOpen",
                formik.values.daysOpen.filter((day) => day !== dayValue)
            );
        } else {
            setDaysOpen([...daysOpen, dayValue]);
            formik.setFieldValue("daysOpen", [
                ...formik.values.daysOpen,
                dayValue,
            ]);
        }
    };

    return (
        <>
            <Loading openLoading={isLoading} />
            <div className="flex flex-col mb-[10vh]">
                <form onSubmit={formik.handleSubmit}>
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:shopName")}
                    </p>
                    <input
                        {...formik.getFieldProps("title")}
                        onBlur={formik.handleBlur}
                        type="text"
                        name="title"
                        style={{
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        placeholder={t("placeholder:shopName")}
                        className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${formik.errors?.title
                            ? "border-2 border-rose-500"
                            : "border border-black-50"
                            }`}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.title}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:location")}
                    </p>
                    <SearchMap
                        handleChangeLocation={handleChangeLocation}
                        oldAddress={locationData.address}
                    />
                    {formik.touched.location && formik.errors.location ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.location}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:openTime")}
                    </p>
                    <div className="flex justify-between mt-1">
                        {dayOfWeek(language)?.map((day, index) => (
                            <div
                                onClick={() => toggleDay(day.value)}
                                key={index}
                                style={{
                                    width: "45px",
                                    height: "47px",
                                    borderColor: isDaySelected(day.value)
                                        ? "#020873"
                                        : `${alpha("#000000", 0.2)}`,
                                    backgroundColor: isDaySelected(day.value)
                                        ? "rgb(2, 8, 115,0.2)"
                                        : "white",
                                }}
                                className={`
                            ${isDaySelected(day.value)
                                        ? "border-custom-color border-2"
                                        : "border-black-50 border"
                                    }
                            flex items-center justify-center rounded-lg`}>
                                {day.name}
                            </div>
                        ))}
                    </div>
                    {formik.touched.daysOpen && formik.errors.daysOpen ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.daysOpen}
                        </div>
                    ) : null}
                    <div className="flex justify-between mt-2">
                        <div
                            style={{
                                width: "156px",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg focus:outline-none flex gap-1 border-black-50 border justify-between items-center p-4">
                            <div
                                style={{
                                    fontSize: "14px",
                                    marginRight: "15px",
                                }}>
                                {t("from")}
                            </div>
                            <div className="flex">
                                <input
                                    className="font-black-500 focus:outline-none"
                                    {...formik.getFieldProps("openTime")}
                                    type="time"
                                    style={{
                                        border: "none",
                                    }}
                                    value={formik.values.openTime}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            -
                        </div>
                        <div
                            style={{
                                width: "156px",
                                height: "51px",
                                borderColor: `${alpha("#000000", 0.2)}`,
                            }}
                            className="rounded-lg focus:outline-none flex gap-1 border-black-50 border justify-between items-center p-4">
                            <div style={{ fontSize: "14px" }}>{t("to")}</div>
                            <div className="flex">
                                <input
                                    className="focus:outline-none"
                                    {...formik.getFieldProps("closeTime")}
                                    type="time"
                                    style={{ border: "none" }}
                                    value={formik.values.closeTime}
                                />
                            </div>
                        </div>
                    </div>
                    {formik.touched.closeTime && formik.errors.closeTime ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.closeTime}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-3 font-semibold">
                        {t("form:business:create:businessNumber")}
                    </p>
                    <input
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        style={{
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        placeholder={t("placeholder:businessNumber")}
                        className={`mt-1 w-full p-4 text-sm border rounded-lg focus:outline-none ${formik.errors?.phoneNumber
                            ? "border-2 border-rose-500"
                            : "border border-black-50"
                            }`}
                        maxLength={10}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-red-500 mt-1">
                            {formik.errors.phoneNumber}
                        </div>
                    ) : null}
                    <div className="flex mt-3 items-center gap-1">
                        <div
                            style={{ fontSize: "14px" }}
                            className="font-semibold">
                            {t("form:business:create:shortDescribe")}
                        </div>
                        <div style={{ fontSize: "14px" }}>
                            ({t("fragment:optional")})
                        </div>
                    </div>
                    <div
                        className="mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none"
                        style={{
                            height: "124px",
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            placeholder={t("placeholder:shortDescribe")}
                            className="w-full focus:outline-none resize-none"
                            rows={3}
                            maxLength={150}
                        />
                    </div>

                    {action == "edit" && (
                        <InsertImages
                            previewImages={previewImages}
                            handleClearImages={handleClearImages}
                            handleFileChange={handleFileChange}
                            setPreviewImages={setPreviewImages}
                        />
                    )}

                    <div className="w-full flex justify-center bottom-0 inset-x-0 fixed">
                        <button
                            type="button"
                            className={`w-[95vw] p-3 my-3 text-white text-[14px] bg-deep-blue rounded-lg font-semibold`}
                            onClick={() => formik.handleSubmit()}>
                            {t("button:next")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
