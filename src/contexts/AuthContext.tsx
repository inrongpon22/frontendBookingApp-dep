import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const token = localStorage.getItem("token");

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    useEffect(() => {
        // console.log(token);
        if (token) {
            setIsAuthenticated(true);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
