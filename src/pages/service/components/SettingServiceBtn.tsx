import { alpha } from '@mui/material';
import { t } from 'i18next';
import { ToggleButton as MuiToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface IParams {
    isAutoApprove: boolean;
    isHidePrice: boolean;
    isHideEndTime: boolean;
    handleAutoApprove: () => void;
    handleHidePrice: () => void;
    handleHideEndTime: () => void;
}

export default function SettingServiceBtn(props: IParams) {
    return (
        <>
            <div
                style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                <div className="w-[60vw]">
                    <div className="text-[14px]">
                        {t("isAutoApprove")}
                    </div>
                    <p className="text-[#6A6A6A] font-[12px]">
                        {t("desc:autoApprove")}
                    </p>
                </div>
                <MuiToggleButton
                    value={props.isAutoApprove}
                    aria-label="Toggle switch"
                    onClick={props.handleAutoApprove}
                    sx={{
                        width: 49, height: 28, borderRadius: 16, backgroundColor: props.isAutoApprove ? '#020873' : '#ffffff',
                        border: props.isAutoApprove ? '1px solid #020873' : '1px solid  #9E9E9E', ":focus"
                            : { outline: "none" }, ":hover": { backgroundColor: props.isAutoApprove ? '#020873' : '#ffffff' }
                    }}
                >
                    <span
                        style={{
                            width: 23, height: 23, marginLeft: props.isAutoApprove ? '' : "1px", marginRight: props.isAutoApprove ? '100px' : " ",
                            backgroundColor: props.isAutoApprove ? '#ffffff' : '#9E9E9E', color: props.isAutoApprove ? '#020873' : '#ffffff', borderRadius: "50%"
                        }}
                        className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${props.isAutoApprove ? 'transform translate-x-full' : ''
                            }`}
                    >
                        {props.isAutoApprove ? <CheckIcon sx={{ fontSize: "14px" }} /> : <CloseIcon sx={{ fontSize: "14px" }} />}
                    </span>
                </MuiToggleButton>
            </div>
            {/* <div
                style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                <div>{t("isHideServPrice")} </div>
                <MuiToggleButton
                    value={props.isHidePrice}
                    aria-label="Toggle switch"
                    onClick={props.handleHidePrice}
                    sx={{
                        width: 49, height: 28, borderRadius: 16, backgroundColor: props.isHidePrice ? '#020873' : '#ffffff',
                        border: props.isHidePrice ? '1px solid #020873' : '1px solid  #9E9E9E', ":focus"
                            : { outline: "none" }, ":hover": { backgroundColor: props.isHidePrice ? '#020873' : '#ffffff' }
                    }}
                >
                    <span
                        style={{
                            width: 23, height: 23, marginLeft: props.isHidePrice ? '' : "1px", marginRight: props.isHidePrice ? '100px' : " ",
                            backgroundColor: props.isHidePrice ? '#ffffff' : '#9E9E9E', color: props.isHidePrice ? '#020873' : '#ffffff', borderRadius: "50%"
                        }}
                        className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${props.isHidePrice ? 'transform translate-x-full' : ''
                            }`}
                    >
                        {props.isHidePrice ? <CheckIcon sx={{ fontSize: "14px" }} /> : <CloseIcon sx={{ fontSize: "14px" }} />}
                    </span>
                </MuiToggleButton>
            </div>
            <div
                style={{ borderColor: `${alpha("#000000", 0.2)}` }}
                className="flex justify-between p-3 text-sm border rounded-lg focus:outline-none items-center">
                <div>{t("isHideEndDate")}</div>
                <MuiToggleButton
                    value={props.isHideEndTime}
                    aria-label="Toggle switch"
                    onChange={props.handleHideEndTime}
                    sx={{
                        width: 49, height: 28, borderRadius: 16, backgroundColor: props.isHideEndTime ? '#020873' : '#ffffff',
                        border: props.isHideEndTime ? '1px solid #020873' : '1px solid  #9E9E9E', ":focus"
                            : { outline: "none" }, ":hover": { backgroundColor: props.isHideEndTime ? '#020873' : '#ffffff' }
                    }}
                >
                    <span
                        style={{
                            width: 23, height: 23, marginLeft: props.isHideEndTime ? '' : "1px", marginRight: props.isHideEndTime ? '100px' : " ",
                            backgroundColor: props.isHideEndTime ? '#ffffff' : '#9E9E9E', color: props.isHideEndTime ? '#020873' : '#ffffff', borderRadius: "50%"
                        }}
                        className={`absolute left-0 rounded-full 
                                shadow-md flex items-center justify-center transition-transform duration-300 ${props.isHideEndTime ? 'transform translate-x-full' : ''
                            }`}
                    >
                        {props.isHideEndTime ? <CheckIcon sx={{ fontSize: "14px" }} /> : <CloseIcon sx={{ fontSize: "14px" }} />}
                    </span>
                </MuiToggleButton>
            </div> */}
        </>
    );
}
