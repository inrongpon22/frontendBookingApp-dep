import { alpha } from "@mui/material";
import { t } from "i18next";

interface IParams {
    availableFromDate: string;
    setAvailableFromDate: (value: string) => void;
    availableToDate: string;
    setAvailableToDate: (value: string) => void;
}

export default function SelectOpenDate(props: IParams) {
    return (
        <div>
            <p
                className="font-semibold"
                style={{ fontSize: "14px" }}>
                {t("availableDate")}
            </p>
            <div className="flex justify-between mt-3">
                <div
                    style={{
                        width: "45%",
                        height: "51px",
                        borderColor: `${alpha("#000000", 0.2)}`,
                    }}
                    className="rounded-lg flex items-center gap-4 border p-2 justify-between">
                    <div
                        style={{
                            fontSize: "14px",
                            marginRight: "-10px",
                        }}>
                        {t("from")}
                    </div>
                    <input
                        className="focus:outline-none text-black-500 text-xs"
                        type="date"
                        style={{ border: "none" }}
                        name="availableFromDate"
                        min={new Date().toISOString().split("T")[0]}
                        value={props.availableFromDate}
                        onChange={(e) =>
                            props.setAvailableFromDate(e.target.value)
                        }
                    />
                </div>
                <div className="flex justify-center items-center">
                    -
                </div>
                <div
                    style={{
                        width: "45%",
                        height: "51px",
                        borderColor: `${alpha("#000000", 0.2)}`,
                    }}
                    className="rounded-lg flex items-center gap-4 border border-black-50 p-2 justify-between">
                    <div
                        style={{
                            fontSize: "14px",
                            marginRight: "10px",
                        }}>
                        {t("to")}
                    </div>
                    <input
                        className="focus:outline-none text-black-500 text-xs"
                        type="date"
                        style={{ border: "none" }}
                        name="availableToDate"
                        min={props.availableFromDate}
                        value={props.availableToDate}
                        onChange={(e) =>
                            props.setAvailableToDate(e.target.value)
                        }
                    />
                </div>
            </div>

        </div>
    );
}
