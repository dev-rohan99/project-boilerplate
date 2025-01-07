import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateGuard = () => {
    const { isAuthenticated, token } = useSelector((state) => state.auth);

    if (localStorage.getItem("authToken")) {
        return isAuthenticated && token ? <Outlet /> : <Navigate to="/login" />;
    }
    return <Navigate to="/login" />;
};

export default PrivateGuard;
