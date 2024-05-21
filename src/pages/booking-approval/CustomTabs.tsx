import { Box, Tab, Tabs, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomTabsProps {
    tabStatus: number;
    setTabStatus: Function;
    tabData: any;
}

const CustomTabs = (
    { tabStatus, setTabStatus }: CustomTabsProps,
    tabData: any
) => {
    const { t } = useTranslation();
    const AntTabs = styled(Tabs)({
        "& .MuiTabs-indicator": {
            display: "none",
        },
    });

    const AntTab = styled((props: any) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            fontWeight: theme.typography.fontWeightRegular,
            margin: theme.spacing(1),
            padding: "8px 16px !important",
            color: "rgba(0, 0, 0, 0.85)",
            "&:hover": {
                color: "#40a9ff",
                opacity: 1,
            },
            "&.Mui-selected": {
                color: "#020873",
                background: "#E6E7F1",
                border: "1px solid #020873 !important",
                fontWeight: theme.typography.fontWeightMedium,
                borderRadius: "66px",
            },
        })
    );
    return (
        <Box sx={{ bgcolor: "#fff" }}>
            <AntTabs
                value={tabStatus}
                onChange={(_, newValue: number) => setTabStatus(newValue)}
            >
                <AntTab
                    label={`${t("pending")} `}
                    // ${
                    //     tabStatus == 0
                    //         ? `| ${
                    //               tabData
                    //                   ? tabData?.reduce(
                    //                         (prev: any, curr: any) =>
                    //                             prev + curr.children.length,
                    //                         0
                    //                     )
                    //                   : 0
                    //           }`
                    //         : ""
                    // }
                />
                <AntTab
                    label={`${t("approved")} `}
                    // ${
                    //     tabStatus == 1
                    //         ? `| ${
                    //               tabData
                    //                   ? tabData?.reduce(
                    //                         (prev: any, curr: any) =>
                    //                             prev + curr.children.length,
                    //                         0
                    //                     )
                    //                   : 0
                    //           }`
                    //         : ""
                    // }
                />
                <AntTab
                    label={`${t("cancelled")} `}
                    // ${
                    //     tabStatus == 2
                    //         ? `| ${
                    //               tabData
                    //                   ? tabData?.reduce(
                    //                         (prev: any, curr: any) =>
                    //                             prev + curr.children.length,
                    //                         0
                    //                     )
                    //                   : 0
                    //           }`
                    //         : ""
                    // }
                />
            </AntTabs>
        </Box>
    );
};

export default CustomTabs;
