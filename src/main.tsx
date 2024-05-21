import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import BusinessContext from "./contexts/BusinessContext.tsx";
import { SWRConfig } from "swr";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SWRConfig value={{
            revalidateOnFocus: false,
        }}>
            <BusinessContext>
                <App />
            </BusinessContext>
        </SWRConfig>
    </React.StrictMode>
);
