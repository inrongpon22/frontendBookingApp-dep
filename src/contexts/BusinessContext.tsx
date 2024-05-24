import { createContext, useState } from "react";
import Loading from "../components/dialog/Loading";
export const GlobalContext = createContext<any>(null); //create context to store all the data

const BusinessContext = ({ children }: any) => {
    const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
    // handle dialog
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [dialogState, setDialogState] = useState<string | undefined>(
        "phone-input"
    );

    // user
    const [userId, setUserId] = useState<number>(0)

    return (
        <GlobalContext.Provider
            value={{
                isGlobalLoading,
                setIsGlobalLoading,
                showDialog,
                setShowDialog,
                dialogState,
                setDialogState,
                userId,
                setUserId
            }}
        >
            {children}
            <Loading openLoading={isGlobalLoading} />
        </GlobalContext.Provider>
    );
};

export default BusinessContext;
