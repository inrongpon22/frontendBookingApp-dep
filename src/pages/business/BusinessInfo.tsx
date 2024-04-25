import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { IBusinessInfo, ILocation } from "./interfaces/business";
import { ChangeEvent, useState } from "react";
import { useFormik } from "formik";
import { alpha, Badge, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../helper/createSupabase";
import SearchMap from "./SearchMap";
import { dataOfWeekEng } from "../../helper/daysOfWeek";
import { insertBusiness } from "../../api/business";

export default function BusinessInfo() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File[]>([]);
    const [imagesURL, setImagesURL] = useState<string[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [locationData, setLocationData] = useState<ILocation>({
        lat: 0,
        lng: 0,
        address: "",
    });
    const [daysOpen, setDaysOpen] = useState<string[]>([]);
    const businessInfo: IBusinessInfo = {
        title: "",
        description: "",
        phoneNumber: "",
    };

    const schema = Yup.object().shape({
        title: Yup.string()
            .min(2, "Title must be at least 2 characters")
            .max(50, "Title must be at most 50 characters")
            .required("Title is required"),
        phoneNumber: Yup.string()
            .matches(/^[0-9]+$/, "Phone number must contain only digits")
            .min(10, "Phone number must be at least 10 digits")
            .max(10, "Phone number must be at most 10 digits")
            .required("Phone number is required"),
        description: Yup.string().max(
            200,
            "Description must be at most 200 characters"
        ),
    });

    const handleChangeLocation = (inputData: ILocation) => {
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

            setFile((prevFiles) => {
                if (newFile) {
                    return [...prevFiles, newFile];
                } else {
                    return prevFiles;
                }
            });
        }
    };

    const handleFormSubmit = async () => {
        const uniqueRandomNumber = generateUniqueRandomNumber();
        if (file) {
            file.forEach(async (element) => {
                const { data, error } = await supabase.storage
                    .from("BookingSystem/images")
                    .upload(
                        file !== null
                            ? element.name + `${uniqueRandomNumber}`
                            : "",
                        element
                    );
                if (error) {
                    console.error(error);
                } else {
                    console.log(data.path);
                    if (imagesURL.length > 1) {
                        setImagesURL((prevImagesURL) => {
                            return [...prevImagesURL, data.path];
                        });
                    } else {
                        setImagesURL([data.path]);
                    }
                }
            });
        } else {
            return;
        }
    };

    const formik = useFormik({
        initialValues: {
            title: businessInfo.title || "",
            phoneNumber: businessInfo.phoneNumber || "",
            description: businessInfo.description || "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            handleFormSubmit();
            const insertData = {
                title: values.title,
                imagesURL: imagesURL,
                description: values.description,
                phoneNumber: values.phoneNumber,
                address: locationData.address,
                latitude: locationData.lat,
                longitude: locationData.lng,
                daysOpen: daysOpen,
                userId: 13,
            };
            const business = await insertBusiness(insertData);

            localStorage.setItem('businessId', String(business.data.businessId));
            navigate(`/service/${business.data.businessId}`);
        },
    });

    const handleClearImages = (index: number) => {
        setPreviewImages((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
        setFile((prevFiles) => {
            const newImages = [...prevFiles];
            newImages.splice(index, 1);
            return newImages;
        });
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
    };

    return (
        <>
            <div className="flex flex-col mb-32 ">
                <form onSubmit={formik.handleSubmit}>
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        Shop name
                    </p>
                    <input
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        name="title"
                        style={{
                            color: "#8B8B8B",
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        placeholder="fill the name of your store"
                        className={`mt-1 w-full p-4 border-black-50 text-sm border rounded-lg focus:outline-none ${formik.errors?.title
                            ? "border-2 border-rose-500"
                            : "border border-black-50"
                            }`}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500">
                            {formik.errors.title}
                        </div>
                    ) : null}
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        Location
                    </p>
                    <SearchMap handleChangeLocation={handleChangeLocation} />
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-4 font-semibold">
                        Open time
                    </p>
                    <div className="flex justify-between mt-1">
                        {dataOfWeekEng.map((day, index) => (
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
                                From
                            </div>
                            <div className="flex">
                                <input
                                    className="font-black-500 focus:outline-none"
                                    value={openTime}
                                    onChange={(e) =>
                                        setOpenTime(e.target.value)
                                    }
                                    type="time"
                                    style={{
                                        border: "none",
                                    }}
                                />
                                {/* <div
                            className="flex flex-col"
                            style={{ marginLeft: "-20px" }}>
                            <KeyboardArrowUpIcon sx={{ fontSize: "20px" }} />
                            <KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />
                        </div> */}
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
                            <div style={{ fontSize: "14px" }}>To</div>
                            <div className="flex">
                                <input
                                    className="focus:outline-none"
                                    value={closeTime}
                                    onChange={(e) =>
                                        setCloseTime(e.target.value)
                                    }
                                    type="time"
                                    style={{ border: "none" }}
                                />
                                {/* <div
                            className="flex flex-col"
                            style={{ marginLeft: "-20px" }}>
                            <KeyboardArrowUpIcon sx={{ fontSize: "20px" }} />
                            <KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />
                        </div> */}
                            </div>
                        </div>
                    </div>
                    <p
                        style={{ fontSize: "14px" }}
                        className="mt-3 font-semibold">
                        Business number
                    </p>
                    <input
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type="text"
                        style={{
                            color: "#8B8B8B",
                            borderColor: `${alpha("#000000", 0.2)}`,
                        }}
                        placeholder="enter the service phone number"
                        className={`mt-1 w-full p-4 text-sm border rounded-lg focus:outline-none ${formik.errors?.phoneNumber
                            ? "border-2 border-rose-500"
                            : "border border-black-50"
                            }`}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-red-500">
                            {formik.errors.phoneNumber}
                        </div>
                    ) : null}
                    <div className="flex mt-3 items-center gap-1">
                        <div
                            style={{ fontSize: "14px" }}
                            className="font-semibold">
                            Short describe
                        </div>
                        <div style={{ fontSize: "14px" }}>(optional)</div>
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
                            style={{ color: "#8B8B8B" }}
                            placeholder="briefly introduce your store "
                            className="w-full focus:outline-none resize-none"
                            rows={3}
                            maxLength={150}
                        />
                    </div>
                    <div className="mt-4 flex">
                        <div className="font-semibold mr-1">Image</div>
                        <div style={{ color: "gray" }}>(optional)</div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {previewImages.map((image, index) => (
                            <div key={index} className="mt-3">
                                <Badge
                                    onClick={() => handleClearImages(index)}
                                    badgeContent={
                                        <IconButton
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
                                    id={`fileInput`}
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <AddIcon />
                            </label>
                        </div>
                    </div>

                    <div className="w-full flex justify-center fixed bottom-0 inset-x-0 gap-2">
                        <button
                            type="submit"
                            // onClick={() => navigate()}
                            className="text-white mt-4 rounded-lg font-semibold mb-6"
                            style={{
                                width: "343px",
                                height: "51px",
                                cursor: "pointer",
                                backgroundColor: "#020873",
                                fontSize: "14px",
                            }}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
