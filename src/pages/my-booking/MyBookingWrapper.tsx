/** @format */

import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { app_api } from "../../helper/url";
// icons
// import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { GlobalContext } from "../../contexts/BusinessContext";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Divider, styled } from "@mui/material";

const MyBookingWrapper = () => {
	const location = useLocation();
	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("userId");

	const { t } = useTranslation();

	const { setShowDialog } = useContext(GlobalContext);

	// State for loading
	const [isLoading, setIsLoading] = useState(true);

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

	// Custom Divider Component with status prop
	const CustomDivider = styled(Divider)<{ status: string }>(({ status }) => ({
		height: "100%",
		width: 4,
		backgroundColor:
			status === "pending"
				? "#F0AD4E"
				: status === "approval"
				? "#2E7CF6"
				: "#A1A1A1",
		margin: "0 0 0 -5px",
		position: "absolute", // Position the divider absolutely within its container
		left: 0,
		borderRadius: "10px",
	}));

	useEffect(() => {
		document.title = t("title:myBookings");
		if (!token) {
			setShowDialog(true);
		} else {
			// Set loading state to false when data is fetched
			setIsLoading(false);
		}
	}, [setShowDialog, t, token]); // Include dependencies for useEffect

	return (
		<>
			<div className='flex flex-col h-dvh gap-4 bg-[#F7F7F7]'>
				<span className='flex justify-between items-center text-[17px] font-semibold bg-white p-5'>
					{t("title:myBookings")}
					{/* <SearchRoundedIcon /> */}
				</span>
				<div className='flex flex-col gap-4 px-3'>
					{isLoading ? (
						<>Loading...</>
					) : myReservDatas ? (
						myReservDatas.map((item: any, index: number) => {
							const start: string = `${moment(item.bookingDate).format(
								"YYYY-MM-DD"
							)}T${item.startTime}Z`;
							const end: string = `${moment(item.bookingDate).format(
								"YYYY-MM-DD"
							)}T${item.endTime}Z`;

							// Calculate the duration in hours
							const durationHours = moment
								.duration(moment(end).diff(moment(start)))
								.asHours();

							return (
								<div key={index} className='relative'>
									<div className='flex'>
										<CustomDivider status={item.status} />
										<div className='flex flex-col w-[100vw] rounded-r-md p-5 bg-white'>
											<div className='flex justify-between'>
												<span className='text-[14px] font-bold'>
													{item.businessName}
												</span>
												<span
													className={`text-end text-[14px] font-bold ${
														item.status === "pending"
															? "text-[#F0AD4E] bg-[#FFF1E0] rounded-md"
															: item.status === "approval"
															? "text-[#2E7CF6] bg-[#F3F8FF] rounded-md"
															: "text-[#A1A1A1] bg-[#F1F1F1] rounded-md"
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
													<FiberManualRecordIcon sx={{ fontSize: "5px" }} />{" "}
													{moment(start).format("HH:mm")} -{" "}
													{moment(end).format("HH:mm")}
												</span>
											</div>
											<div className='flex justify-between mt-2'>
												<div className='flex items-center gap-2'>
													<span className='text-[14px] font-normal'>
														{item.title}
													</span>
													<span className='text-[14px] font-normal'>
														{durationHours} hrs
													</span>
												</div>
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
