import { Modal } from "@mui/material";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { shareBookingLink } from "../../helper/alerts";
import LinkIcon from "@mui/icons-material/Link";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { generateShortURL } from "../../api/generateQR";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
interface IProps {
    open: boolean;
    url: string;
    businessId: string;
    handleClose: () => void;
}

export default function ShareQR(props: IProps) {
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const [shortUrl, setShortUrl] = useState("");
    const handleDownloadQRCode = () => {
        if (qrCodeRef.current) {
            html2canvas(qrCodeRef.current).then((canvas) => {
                const qrCodeImage = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                const downloadLink = document.createElement("a");
                downloadLink.href = qrCodeImage;
                downloadLink.download = "qr-code.png";
                downloadLink.click();
            });
        }
    };

    useEffect(() => {
        const fetchShortUrl = async () => {
            try {
                const response = await generateShortURL(props.url);
                setShortUrl(response as string); // Update the state with the short URL
            } catch (error) {
                console.error("Error generating short URL:", error);
            }
        };

        fetchShortUrl();
    }, [props.url]);

    return (
        <Modal onClose={props.handleClose} open={props.open}>
            <div
                style={{
                    top: "50%",
                    left: "50%",
                    width: "343px",
                    height: "auto",
                    background: "white",
                    transform: "translate(-50%, -50%)",
                    outline: "none",
                    borderRadius: "10px",
                    boxShadow:
                        "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    padding: "20px",
                }}
                className="absolute focus:bg-none rounded-lg p-6">
                <div
                    className="flex justify-end mb-2"
                    onClick={props.handleClose}>
                    <CloseOutlinedIcon />
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-[18px] mb-5">{t("desc:desScanMe")}</p>
                    <div ref={qrCodeRef}>
                        <QRCode value={shortUrl} size={256} />
                    </div>

                    <button
                        type="button"
                        className="text-center p-3 w-full mt-4 bg-deep-blue bg-opacity-80 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            shareBookingLink(props.businessId);
                        }}>
                        <LinkIcon />
                        <span className="mx-2">
                            {t("button:shareBookingLink")}
                        </span>
                    </button>
                    <button
                        type="button"
                        className="w-full mt-4 bg-deep-blue bg-opacity-10 text-deep-blue text-opacity-80 font-bold py-2 px-4 rounded"
                        onClick={handleDownloadQRCode}>
                        {t("button:saveQRcode")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
