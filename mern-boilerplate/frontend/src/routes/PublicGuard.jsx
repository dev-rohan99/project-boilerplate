import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicGuard = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (localStorage.getItem("authToken")) {
        return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
    }
    return <Outlet />;
};

export default PublicGuard;
