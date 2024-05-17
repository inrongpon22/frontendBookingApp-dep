import { createContext, useState } from "react";
export const GlobalContext = createContext<any>(null); //create context to store all the data

const BusinessContext = ({ children }: any) => {
    const [number, setNumber] = useState<number>(0);

    return (
        <GlobalContext.Provider value={{ number, setNumber }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default BusinessContext;
