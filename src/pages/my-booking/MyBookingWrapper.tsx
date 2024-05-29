/** @format */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { app_api } from "../../helper/url";
// icons
// import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { GlobalContext } from "../../contexts/BusinessContext";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Divider } from "@mui/material";

const MyBookingWrapper = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("userId");

	const { t } = useTranslation();

	const { setShowDialog } = useContext(GlobalContext);

	const { data: myReservDatas } = useSWR(
		token &&
			`${app_api}/getReservationByUserId/${
				userId ? userId : location.state.userId
			}?page=1&limit=1000`,
		(url: string) =>
			axios
				.get(url, {
					headers: {
						Authorization: token,
					},
				})
				.then((res) => res.data)
				.catch((err) => {
					console.log(err);
					toast.error("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง");
				})
	);

	useEffect(() => {
		document.title = t("title:myBookings");
		if (!token) {
			setShowDialog(true);
		}
	}, []);

	return (
		<>
			<div className='flex flex-col h-dvh gap-4 bg-[#F7F7F7]'>
				<span className='flex justify-between items-center text-[17px] font-semibold bg-white p-5'>
					{t("title:myBookings")}
					{/* <SearchRoundedIcon /> */}
				</span>
				<div className='flex flex-col gap-4 px-3'>
					{myReservDatas ? (
						myReservDatas.map((item: any, index: number) => {
							const start: string = `${moment(item.bookingDate).format(
								"YYYY-MM-DD"
							)}T${item.startTime}Z`;
							const end: string = `${moment(item.bookingDate).format(
								"YYYY-MM-DD"
							)}T${item.endTime}Z`;
							return (
								<div key={index} className='relative'>
									<Divider orientation='vertical' flexItem />
									<div className='flex flex-col rounded-lg p-5 bg-white w-[340px]'>
										<div className='flex justify-between'>
											<span className='text-[14px] font-bold'>
												{item.businessName}
											</span>
											<span
												className={`text-end text-[14px] font-bold ${
													item.status === "pending"
														? "text-[#F0AD4E] bg-[#FFF1E0] rounded-md"
														: item.status === "approval"
														? "text-[#2E7CF6] bg-[#F2F2F8] rounded-md"
														: "text-[#A1A1A1]"
												}`}
											>
												{item.status === "pending"
													? t("pending")
													: item.status === "approval"
													? t("approved")
													: t("cancelled")}
											</span>
										</div>
										<div className='flex justify-between mt-2'>
											<span className='text-[14px] font-normal'>
												{moment(item.bookingDate).format("D MMM")}{" "}
												<FiberManualRecordIcon sx={{ fontSize: "10px" }} />{" "}
												{moment(start).format("HH:mm")} -{" "}
												{moment(end).format("HH:mm")}
											</span>
										</div>
										<div className='flex justify-between mt-2'>
											<span className='text-[14px] font-normal'>
												{item.title}
											</span>

											<div className='flex justify-between mt-2'>
												<div className='flex items-center gap-2'>
													<span className='text-[12px] font-normal'>
														฿ {item.price}
													</span>
													<span className='text-[12px] font-normal'>
														<PersonOutlineRoundedIcon fontSize='small' />
														{item.guestNumber}
													</span>
												</div>
											</div>
										</div>
										<p className='flex gap-5 text-[12px] font-normal mt-5'>
											{/* <span className="flex items-center cursor-pointer hover:text-deep-blue">
                                            Call
                                            <NavigateNextRoundedIcon fontSize="small" />
                                        </span> */}
											<span
												className='flex items-center cursor-pointer hover:text-deep-blue'
												onClick={() => navigate(`/booking/${item.id}`)}
											></span>
										</p>
									</div>
								</div>
							);
						})
					) : (
						<>Loading...</>
					)}
				</div>
			</div>
			<DialogWrapper userSide='user' />
		</>
	);
};

export default MyBookingWrapper;
