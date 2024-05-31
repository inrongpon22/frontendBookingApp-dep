import { useEffect, useState } from 'react';
import { alpha, Modal, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface IProps {
    open: boolean;
    title: string;
    description: string;
    bntConfirm: string;
    bntBack: string;
    sendMessageOption: string;
    btnSMS: string;
    btnLINE: string;
    handleClose: () => void;
    handleConfirm?: () => void;
    handleCancelBooking?: () => void;
    handleNoticeType: (e:string) => void;
    imageSrc: string; // Add imageSrc prop
    noticeType: string
}

export default function SendMessageOption(props: IProps) {
    console.log(props.noticeType)
    const [smsChecked, setSmsChecked] = useState(true); // Default SMS checked
    const [lineChecked] = useState(false);//setLineChecked

    const handleSmsClick = () => {
        setSmsChecked(!smsChecked); // Toggle SMS checked state
    };
    
    // const handleLineClick = () => {
    //     setLineChecked(!lineChecked); // Toggle LINE checked state
    // };

    useEffect(() => {
        if (smsChecked && lineChecked) {
            props.handleNoticeType("all"); 
        } else if (smsChecked) { 
            props.handleNoticeType("sms"); 
        } else if(lineChecked) {
            props.handleNoticeType("line"); // If SMS is unchecked, LINE is the only option
        } else {
            props.handleNoticeType("")
        }

    }, [smsChecked, lineChecked])

    return (
        <Modal onClose={props.handleClose} open={props.open}>
            <div
                style={{
                    top: "50%",
                    left: "50%",
                    width: "auto",
                    height: "auto",
                    background: "white",
                    transform: "translate(-50%, -50%)",
                    outline: "none",
                }}
                className="absolute focus:bg-none rounded-lg p-6">
                
                <button
                onClick={props.handleClose}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                <CloseIcon />
            </button>
                <div className="flex w-full justify-center mb-3">
                    <img src={props.imageSrc} className="w-12 h-12 rounded-full" />
                </div>
                <Typography
                    textAlign={"center"}
                    id="modal-modal-title"
                    sx={{ fontWeight: "bold", fontSize: "17px" }}>
                    {props.title}
                </Typography>
                <Typography
                    sx={{
                        textAlign: "center",
                        color: alpha("#000000", 0.6),
                        fontSize: "14px",
                        fontWeight: "normal",
                    }}>
                    {props.description}   
                </Typography>

                
                <div className="border-t border-gray-300 my-3"></div>
                    <Typography 
                    textAlign={"center"}
                    sx={{ 
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: alpha("#000000", 0.6),
                         }}>
                    {props.sendMessageOption}
                    </Typography>
                <div className="flex-col w-full gap-2 mt-3 cursor-pointer text-[#000000] text-[14px]">
                 <div 
                    className="font-normal rounded-lg px-3 py-3 flex items-center justify-between border-2 mt-3"
                    onClick={handleSmsClick} // Add onClick to the div
                    style={{
                        backgroundColor: smsChecked ? '#EAEBF3' : '#fff',
                        fontWeight: smsChecked ? "bold" : "normal",
                        color: smsChecked ? "#35398F" : "#000",
                    }}
                 >
                   {smsChecked ? <CheckCircleIcon style={{ color: '#35398F', width:"20px", height:"20px" }} /> : <RadioButtonUncheckedIcon style={{ color: '#ddd', width:"20px", height:"20px" }} />}
                    {props.btnSMS}
                    <div className='pr-3'></div>
                 </div>

                    {/* <div 
                        className="font-normal rounded-lg px-3 py-3 flex items-center justify-between border-2 mt-3" 
                        onClick={handleLineClick} // Add onClick to the div
                        style={{
                            backgroundColor: lineChecked ? '#EAEBF3' : '#fff',
                            fontWeight: lineChecked ? "bold" : "normal",
                            color: lineChecked ? "#35398F" : "#000",
                        }}
                    >
                    {lineChecked ? <CheckCircleIcon style={{ color: '#35398F', width:"20px", height:"20px" }} /> : <RadioButtonUncheckedIcon style={{ color: '#ddd', width:"20px", height:"20px" }} />}
                    {props.btnLINE}
                    <div className='pr-3'></div>
                    </div> */}
                </div>

                <div className="flex justify-between gap-2 mt-4">
                    <button
                        onClick={() => props.handleClose()}
                        style={{
                            width: "151px",
                            height: "51px",
                            fontWeight: "normal",
                            borderColor: alpha("#000", 0.2),
                            borderWidth: "1px",
                            fontSize: "14px",
                            background: "white"
                        }}
                        className="text-[#000] rounded-lg px-6 py-2 transition duration-300 ease-in-out">
                        {props.bntBack}
                    </button>
                    <button 
                    disabled = {props.noticeType == ""}
                        // onClick={() => props.handleConfirm()}
                        onClick={() => {
                            if (props.handleCancelBooking) {
                                props.handleCancelBooking(); // Call handleCancelBooking if it exists
                            } else if (props.handleConfirm) { // Check if handleConfirm is defined
                                props.handleConfirm(); // Call handleConfirm if it exists
                            }
                        }}
                        className="p-3 rounded-lg text-white px-6 py-2 transition duration-100 ease-in-out"
                        style={{
                            width: "151px",
                            height: "51px",
                            fontWeight: "bold",
                            background: props.noticeType == "" ? "#ddd" : "#35398F",
                            fontSize: "14px",
                        }}>
                        {props.bntConfirm}
                    </button>
                </div>
            </div>
        </Modal>
    );
}