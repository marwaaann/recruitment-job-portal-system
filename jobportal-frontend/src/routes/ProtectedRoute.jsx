import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {

        return <h2 className="p-10">Loading...</h2>;

    }

    if (!user) {

        return <Navigate to="/" replace />;

    }

    return children;

}