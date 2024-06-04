import { Box, Tab, Tabs, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomTabsProps {
    tabDate: number;
    setTabDate: Function;
}

const CustomDateTabs = ({ tabDate, setTabDate }: CustomTabsProps) => {
    const { t } = useTranslation();
    const AntTabs = styled(Tabs)({
        "& .MuiTabs-indicator": {
            display: "none",
        },
    });

    const AntTab = styled((props: any) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            minWidth: "auto", // Add this line
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: "14px !important",
            padding: theme.spacing(1, 2),
            margin: theme.spacing(1.5, 1),
            color: "rgba(0, 0, 0, 0.85)",
            background: "#f1f1f1d9",
            borderRadius: "6px",
            "&:hover": {
                opacity: 1,
                color: "#40a9ff",
                background: "#F1F1F1",
            },
            "&.Mui-selected": {
                color: "white",
                fontWeight: theme.typography.fontWeightBold,
                background: "rgba(2, 8, 115, 0.8)",
            },
        })
    );

    const handleChangeDate = (newValue: number) => {
        if (newValue === 2) {
            alert("Select Date");
        } else {
            setTabDate(newValue);
        }
    };

    return (
        <Box sx={{ bgcolor: "#fff" }} className="border-b">
            <AntTabs
                className="px-5"
                value={tabDate}
                onChange={(_, newValue: number) => handleChangeDate(newValue)}
            >
                <AntTab label={`${t("today")} `} />
                <AntTab label={`${t("tomorrow")} `} />
                {/* <AntTab label={`${t("select")} `} /> */}
            </AntTabs>
        </Box>
    );
};

export default CustomDateTabs;
