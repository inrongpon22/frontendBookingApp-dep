import { useEffect, useState } from "react";
import { getLineProfile } from "../../api/user";
import Loading from "../../components/dialog/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { app_api } from "../../helper/url";

export default function CallBack() {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        console.log(accessToken);
        const fetchData = async () => {
            await getLineProfile(accessToken ?? "")
                .then((res) => {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("accessToken", res.sessionToken);
                    axios
                        .get(`${app_api}/getBusinessByUserId/${res.userId}`, {
                            headers: {
                                Authorization: res.token,
                            },
                        })
                        .then((resp) => {
                            if (resp.data.length > 0) {
                                setIsLoading(false);
                                navigate(
                                    `/business-profile/${resp.data[0].id}`
                                );
                            } else {
                                navigate("/create-business");
                            }
                        })
                        .catch((err) => {
                            if (err.response.status === 404) {
                                navigate("/create-business");
                            } else {
                                console.log(err.message);
                                toast.error(
                                    "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง"
                                );
                            }
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        if (accessToken) {
            fetchData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Loading openLoading={isLoading} />
        </div>
    );
}
