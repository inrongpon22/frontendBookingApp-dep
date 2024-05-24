import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useParams } from "react-router-dom";
import { shareBookingLink } from "../../helper/alerts";

interface FirstTimeCongratProps {
    handleClose:Function
}

const FirstTimeCongrat = ({handleClose}:FirstTimeCongratProps) => {
    const { businessId } = useParams();
    return (
        <div className="bg-[#2E7CF6] bg-opacity-10 p-5 mb-2">
            <p className="flex justify-between items-center">
                <span className="text-[17px] font-bold">ยินดีด้วย! 🎉</span>
                <CloseRoundedIcon
                    fontSize="small"
                    color="disabled"
                    onClick={() => handleClose()}
                />
            </p>
            <p className="py-2">
                คุณได้เปิดร้านของคุณเรียบร้อยแล้ว!
                แชร์ลิ้งการจองร้านของคุณเพื่อต้อนรับลูกค้า.
            </p>
            <button
                type="button"
                className="w-full bg-deep-blue bg-opacity-80 p-3 mt-3 text-[14px] font-semibold text-white rounded-lg"
                onClick={() => shareBookingLink(businessId)}
            >
                แชร์ลิ้งการจองร้านของคุณ
            </button>
        </div>
    );
};

export default FirstTimeCongrat;
