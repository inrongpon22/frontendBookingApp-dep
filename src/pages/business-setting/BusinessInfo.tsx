import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormik } from "formik";
import { alpha, Badge, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../helper/createSupabase";
import { dataOfWeekEng, dataOfWeekThai } from "../../helper/daysOfWeek";
import { updateBusiness } from "../../api/business";
import { useTranslation } from "react-i18next";
import {
    IBusinessInfo,
    ILocation,
    IgetBusiness,
} from "../business/interfaces/business";
import SearchMap from "../business/SearchMap";

interface IParams {
    businessData?: IgetBusiness;
    isEdit: boolean;
    handleIsEdit?: () => void;
}

export default function BusinessInfo(props: IParams) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const {
        t,
        i18n: { language },
    } = useTranslation();

    const [files, setFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState(
        props.businessData?.openTime || ""
    );
    const [closeTime, setCloseTime] = useState(
        props.businessData?.closeTime || ""
    );
    const [locationData, setLocationData] = useState<ILocation>({
        lat: props.businessData?.latitude || 0,
        lng: props.businessData?.longitude || 0,
        address: props.businessData?.address || "",
    });
    const [daysOpen, setDaysOpen] = useState<string[]>(
        props.businessData?.daysOpen || []
    );
    const [businessInfo, setBusinessInfo] = useState<IBusinessInfo>({
        title: props.businessData?.title || "",
        daysOpen: props.businessData?.daysOpen || [],
        openTime: props.businessData?.openTime || "",
        closeTime: props.businessData?.closeTime || "",
        phoneNumber: props.businessData?.phoneNumber || "",
        location: props.businessData?.address || "",
        description: props.businessData?.description || "",
    });
    const [isFormModified, setIsFormModified] = useState<boolean>(false);

    useEffect(() => {
        const fetchImageUrls = async () => {
            try {
                const arrayImageUrls: string[] = [];
                if (props.businessData) {
                    const imageUrls = await Promise.all(
                        props.businessData.imagesURL.map(async (element) => {
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
        setCloseTime(props.businessData?.closeTime || "");
        setOpenTime(props.businessData?.openTime || "");
        setBusinessInfo({
            title: props.businessData?.title || "",
            daysOpen: props.businessData?.daysOpen || [],
            openTime: props.businessData?.openTime || "",
            closeTime: props.businessData?.closeTime || "",
            phoneNumber: props.businessData?.phoneNumber || "",
            location: props.businessData?.address || "",
            description: props.businessData?.description || "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.businessData]);

    const dayOfWeek = () => {
        switch (language) {
            case "th":
                return dataOfWeekThai;

            case "en":
                return dataOfWeekEng;

            default:
                return dataOfWeekThai;
        }
    };

    const schema = Yup.object().shape({
        title: Yup.string()
            .min(2, t("formValidation:business:create:shopName:shopNameMin"))
            .max(50, t("formValidation:business:create:shopName:shopNameMax"))
            .required(t("formValidation:business:create:shopName:shopNameReq")),
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

    const handleChangeLocation = (inputData: ILocation) => {
        formik.setFieldValue("location", inputData.address);
        setLocationData(inputData);
    };

    function generateUniqueRandomNumber() {
        let randomNumber;
        const generatedNumbers = new Set();

        do {
            randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
        } while (generatedNumbers.has(randomNumber)); // Check if the number has been generated before

        generatedNumbers.add(randomNumber); // Add the generated number to the set of generated numbers
        return randomNumber;
    }

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
        props.businessData?.imagesURL?.splice(index, 1);
    };

    const isDaySelected = (dayValue: string) => {
        return daysOpen.includes(dayValue);
    };

    const toggleDay = (dayValue: string) => {
        if (isDaySelected(dayValue)) {
            setDaysOpen(daysOpen.filter((day) => day !== dayValue));
        } else {
            setDaysOpen([...daysOpen, dayValue]);
        }
        props.handleIsEdit && props.handleIsEdit();
    };

    const formik = useFormik({
        initialValues: {
            title: businessInfo?.title,
            phoneNumber: businessInfo?.phoneNumber,
            location: businessInfo?.location,
            description: businessInfo?.description,
        },
        validationSchema: schema,
        onSubmit: async (values) => {
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

                const insertData = {
                    title: values.title,
                    imagesURL: imagesURL.concat(props.businessData?.imagesURL || []),
                    description: values.description,
                    phoneNumber: values.phoneNumber,
                    address: locationData.address,
                    latitude: locationData.lat,
                    longitude: locationData.lng,
                    daysOpen: daysOpen,
                    openTime: openTime,
                    closeTime: closeTime,
                    userId: userId ? Number(userId) : 0,
                };

                if (token === null) {
                    throw new Error("Token is not found");
                }

                const business = await updateBusiness(
                    insertData,
                    Number(props.businessData?.id),
                    token
                );
                if (business.status === 200) {
                    navigate(`/business-profile/${props.businessData?.id}`);
                } else {
                    console.error("Error updating business");
                }
            } else {
                const insertData = {
                    title: values.title,
                    imagesURL: props.businessData?.imagesURL || [],
                    description: values.description,
                    phoneNumber: values.phoneNumber,
                    address: locationData.address,
                    latitude: locationData.lat,
                    longitude: locationData.lng,
                    daysOpen: daysOpen,
                    openTime: openTime,
                    closeTime: closeTime,
                    userId: userId ? Number(userId) : 0,
                };
                if (token === null) {
                    throw new Error("Token is not found");
                }

                const business = await updateBusiness(
                    insertData,
                    Number(props.businessData?.id),
                    token
                );
                if (business.status === 200) {
                    navigate(`/business-profile/${props.businessData?.id}`);
                } else {
                    console.error("Error updating business");
                }
            }
        },
    });

    useEffect(() => {
        // Check if the form values have changed
        const formValuesChanged = JSON.stringify(formik.values) !== JSON.stringify(formik.initialValues);

        setIsFormModified(formValuesChanged || props.isEdit);
        // const daysOpenModified = JSON.stringify(props.businessData?.daysOpen) !== JSON.stringify(daysOpen);
        // if (daysOpenModified) {
        //     props.handleIsEdit && props.handleIsEdit();
        // } else {
        //     props.handleIsEdit && props.handleIsEdit();
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values, formik.initialValues]);

    const handleOpenTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOpenTime(e.target.value);
        props.handleIsEdit && props.handleIsEdit();
    };
    const handleCloseTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCloseTime(e.target.value);
        props.handleIsEdit && props.handleIsEdit();
    };

    return (
        <>
            <div className="flex flex-col">
                <form onSubmit={formik.handleSubmit}>
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:shopName")}
                    </p>
                    <input
                        // disabled={!props.isEdit}
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
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        {t("form:business:create:openTime")}
                    </p>
                    <div className="flex justify-between mt-1">
                        {dayOfWeek()?.map((day, index) => (
                            <div
                                onClick={() => toggleDay(day.value)}
                                key={index}
                                style={{
                                    cursor: props.isEdit ? "pointer" : "default",
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
                                    // disabled={!props.isEdit}
                                    className="font-black-500 focus:outline-none"
                                    value={openTime}
                                    onChange={handleOpenTimeChange}
                                    type="time"
                                    style={{
                                        border: "none",
                                    }}
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
                                    value={closeTime}
                                    onChange={handleCloseTimeChange}
                                    type="time"
                                    style={{ border: "none" }}
                                    disabled={openTime === ""}
                                />
                            </div>
                        </div>
                    </div>
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
                            // disabled={!props.isEdit}
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            placeholder={t("placeholder:shortDescribe")}
                            className="w-full focus:outline-none resize-none"
                            rows={3}
                            maxLength={150}
                        />
                    </div>
                    <div className="mt-4 flex">
                        <div className="font-semibold mr-1">
                            {t("form:business:create:images")}
                        </div>
                        <div style={{ color: "gray" }}>
                            ({t("fragment:optional")})
                        </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {previewImages.map((image, index) => (
                            <div key={index} className="mt-3">
                                <Badge
                                    onClick={() => handleClearImages(index)}
                                    badgeContent={
                                        <IconButton
                                            // disabled={!props.isEdit}
                                            size="small"
                                            sx={{
                                                background: "black",
                                                ":hover": {
                                                    background: "black",
                                                },
                                            }}>
                                            <CloseIcon
                                                sx={{
                                                    fontSize: "12px",
                                                    color: "white",
                                                }}
                                            />
                                        </IconButton>
                                    }>
                                    <img
                                        src={image}
                                        className="rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Badge>
                            </div>
                        ))}

                        <div
                            className="outline-dashed outline-1 outline-offset-1 flex items-center justify-center rounded-lg mt-3"
                            style={{ width: "100px", height: "100px" }}>
                            <label
                                htmlFor={`fileInput`}
                                style={{ cursor: "pointer" }}>
                                <input
                                    // disabled={!props.isEdit}
                                    id={`fileInput`}
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <AddIcon />
                            </label>
                        </div>
                    </div>

                    <div className="w-full flex justify-center  inset-x-0 gap-2">
                        <button
                            type="button"
                            className="w-full p-3 my-5 text-white text-[14px] bg-deep-blue rounded-lg font-semibold"
                            disabled={!isFormModified}
                            onClick={() => formik.handleSubmit()}>
                            {t("edit")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
