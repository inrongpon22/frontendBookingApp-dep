import { Badge, IconButton } from "@mui/material";
import { t } from "i18next";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { ChangeEvent } from "react";

interface IParams {
    previewImages: string[];
    setPreviewImages: (value: string[]) => void;
    handleClearImages: (index: number) => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InsertImages(props: IParams) {
    return (
        <div>
            <div className="mt-4 flex">
                <div className="font-semibold mr-1">
                    {t("form:business:create:images")}
                </div>
                <div style={{ color: "gray" }}>
                    ({t("fragment:optional")})
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                {props.previewImages.map((image, index) => (
                    <div key={index} className="mt-3">
                        <Badge
                            onClick={() => props.handleClearImages(index)}
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
                            onChange={props.handleFileChange}
                        />
                        <AddIcon />
                    </label>
                </div>
            </div>
        </div>
    );
}
