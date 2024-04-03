// icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";


const BookingConfirmationPageWrapper = () => {
  const navigate = useNavigate()
  return (
    <div className="relative">
      {/* Starts: back button */}
      <button
        type="button"
        className="absolute top-5 left-5 bg-white py-1 px-3 rounded-lg z-50"
        onClick={() => navigate(-1)}
      >
        <KeyboardBackspaceIcon />
        Back
      </button>
      {/* Starts: back button */}
    </div>
  );
};

export default BookingConfirmationPageWrapper;
