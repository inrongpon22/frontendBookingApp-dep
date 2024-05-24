import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

interface IProps {
    openLoading: boolean;
    title: string;
    description: string;
    btnWord: string;
}

export default function CreateSuccessful(props: IProps) {
    const navigate = useNavigate();
    const { businessId } = useParams();
    if (!props.openLoading) {
        return null;
    }
    return (
        <>
            <div className={props.openLoading ? "hide" : "show"}>
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="flex flex-col justify-between items-center h-full w-5/6">
                        <div className="flex flex-col flex-grow justify-center">
                            <div className="flex justify-center my-12">
                                <CheckCircleOutlinedIcon
                                    sx={{ color: "#020873", fontSize: "10rem" }}
                                />
                            </div>
                            <div className="flex flex-col items-center mb-[10vw]">
                                <div className="text-[32px] font-bold text-center">
                                    All done
                                </div>
                                <div className="text-center">
                                    You've successfully created your business.
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() =>
                            navigate(`/business-profile/${businessId}`)
                        }
                        type="button"
                        style={{ marginBottom: "56px" }}
                        className="py-3 px-10 bg-[#020873] text-white rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]"
                        // onClick={() => setShowDialog(true)}
                    >
                        Go back
                    </button>
                </div>
            </div>
            {/* <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col justify-between items-center h-full w-5/6">
                    <div className="flex flex-col flex-grow justify-center">
                        <div className="flex justify-center my-12">
                            <CheckCircleOutlinedIcon
                                sx={{ color: "#020873", fontSize: "10rem" }}
                            />
                        </div>
                        <div className="flex flex-col items-center mb-[10vw]">
                            <div className="text-[32px] font-bold text-center">
                                All done
                            </div>
                            <div className="text-center">
                                You've successfully created your business.
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/business-profile/${businessId}`)}
                    type="button"
                    style={{ marginBottom: "56px" }}
                    className="py-3 px-10 bg-[#020873] text-white rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]"
                    // onClick={() => setShowDialog(true)}
                >
                    Go back
                </button>
            </div> */}
        </>
    );
}
