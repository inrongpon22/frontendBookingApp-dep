import { Box, Tab, Tabs, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomTabsProps {
    tabStatus: number;
    setTabStatus: Function;
    tabData: any;
}

const CustomStatusTabs = (
    { tabStatus, setTabStatus }: CustomTabsProps,
    _: any
) => {
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
            borderRadius: "4px",
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

    return (
        <Box sx={{ bgcolor: "#fff" }}>
            <AntTabs
            className="px-5"
                value={tabStatus}
                onChange={(_, newValue: number) => setTabStatus(newValue)}
            >
                <AntTab
                    label={`${t("all")} `}
                />
                <AntTab
                    label={`${t("pending")} `}
                />
                <AntTab
                    label={`${t("approved")} `}
                />
                <AntTab
                    label={`${t("cancelled")} `}
                />
            </AntTabs>
        </Box>
    );
};

export default CustomStatusTabs;
