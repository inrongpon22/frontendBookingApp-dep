import { SwipeAction, TrailingActions } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const trailingActions = () => (
    <TrailingActions>
        <SwipeAction onClick={() => console.info("Edit action triggered")}>
            Edit
        </SwipeAction>
        <SwipeAction
            destructive={false}
            onClick={() => console.info("Delete action triggered")}>
            <span className="icon">
                <DeleteOutlineIcon />
            </span>
            Delete
        </SwipeAction>
    </TrailingActions>
);
