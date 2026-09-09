import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const saved = localStorage.getItem("user");

        return saved ? JSON.parse(saved) : null;

    });

    const [loading] = useState(false);

    const login = (userData) => {

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

    };

    const logout = () => {

        localStorage.removeItem("user");

        setUser(null);

    };

    useEffect(() => {

        if (user) {

            localStorage.setItem("user", JSON.stringify(user));

        }

    }, [user]);

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthContext;