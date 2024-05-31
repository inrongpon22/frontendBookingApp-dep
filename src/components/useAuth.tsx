import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../api/user";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token") ?? "";
                if (token) {
                    const response = await checkTokenValidity(token);
                    setIsAuthenticated(response.status === 200);
                } else {
                    setIsAuthenticated(false);
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
                navigate("/login");
            }
        };

        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    return { isAuthenticated };
};
export { useAuth }; // Export the hook for other components to use
