import { Modal } from "@mui/material";
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { shareBookingLink } from "../../helper/alerts";
import LinkIcon from "@mui/icons-material/Link";
import { t } from "i18next";
import { useRef } from "react";
interface IProps {
    open: boolean;
    url: string;
    businessId: string;
    handleClose: () => void;
}

export default function ShareQR(props: IProps) {
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const handleDownloadQRCode = () => {
        if (qrCodeRef.current) {
            html2canvas(qrCodeRef.current).then((canvas) => {
                const qrCodeImage = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                const downloadLink = document.createElement('a');
                downloadLink.href = qrCodeImage;
                downloadLink.download = 'qr-code.png';
                downloadLink.click();
            });
        }
    };
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
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    padding: "20px",
                }}
                className="absolute focus:bg-none rounded-lg p-6"
            >
                <div className="flex flex-col items-center">
                    <div ref={qrCodeRef}>
                        <QRCode value={props.url} size={256} />
                    </div>

                    <button
                        type="button"
                        className="text-start p-3 w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            shareBookingLink(props.businessId);
                        }}
                    >
                        <LinkIcon />
                        <span className="mx-2">{t("button:shareBookingLink")}</span>
                    </button>
                    <button
                        type="button"
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleDownloadQRCode}
                    >
                        Download QR Code
                    </button>
                </div>
            </div>
        </Modal>
    );
}
