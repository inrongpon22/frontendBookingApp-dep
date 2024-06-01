import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import BusinessContext from "./contexts/BusinessContext.tsx";
import { SWRConfig } from "swr";
import { AuthProvider } from "./contexts/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <SWRConfig
                value={{
                    revalidateOnFocus: true,
                }}
            >
                <BusinessContext>
                    <App />
                </BusinessContext>
            </SWRConfig>
        </AuthProvider>
    </React.StrictMode>
);
