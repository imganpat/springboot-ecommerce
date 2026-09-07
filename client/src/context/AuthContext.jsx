import { createContext, useContext, useEffect, useState } from "react";
import { getAuthSession, getToken, removeToken } from "@/utils/auth";

const decodeJwtPayload = (token) => {
    try {
        const payload = token.split(".")[1];
        if (!payload) return {};

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padding = normalized.length % 4;
        const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;

        return JSON.parse(atob(padded));
    } catch {
        return {};
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = getAuthSession();
        const token = session.token || getToken();

        if (token) {
            const decoded = decodeJwtPayload(token);
            const sessionUser = session.user || {};

            setUser({
                token,
                id: sessionUser.id ?? decoded.userId ?? null,
                name: sessionUser.name || decoded.name || sessionUser.email?.split("@")[0] || decoded.sub?.split("@")[0] || "User",
                email: sessionUser.email || decoded.sub || "",
                admin: Boolean(sessionUser.admin ?? decoded.admin),
            });
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    const logout = () => {
        removeToken();
        setUser(null);
    };

    const value = {
        user,
        setUser,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.admin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};