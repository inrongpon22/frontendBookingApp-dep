import { TrailingActions, SwipeAction } from "react-swipeable-list";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export const trailingActions = (
    handleOpenConfirm: (serviceId: number) => void,
    handleSelectService: (serviceId: number) => void,
    serviceId: number
) => (
    <TrailingActions>
        <SwipeAction
            destructive={false}
            onClick={() => handleSelectService(serviceId)}>
            <div
                style={{
                    width: "70px",
                    height: "104px",
                    background: "#898A8D",
                    position: "relative",
                }}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}>
                    <div className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <ModeEditOutlinedIcon
                            sx={{ color: "white", fontSize: "25px" }}
                        />
                    </div>
                </div>
            </div>
        </SwipeAction>
        <SwipeAction
            destructive={false}
            onClick={() => {
                handleOpenConfirm(serviceId);
            }}>
            <div
                style={{
                    width: "70px",
                    height: "104px",
                    background: "#FA6056",
                    position: "relative",
                }}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}>
                    <div className="text-gray-600 hover:text-gray-800 cursor-pointer">
                        <DeleteOutlinedIcon
                            sx={{ color: "white", fontSize: "20px" }}
                        />
                    </div>
                </div>
            </div>
        </SwipeAction>
    </TrailingActions>
);
