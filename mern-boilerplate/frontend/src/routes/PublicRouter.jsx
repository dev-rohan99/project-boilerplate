import AccountActivationCode from "../pages/account-activation-code/AccountActivationCode";
import AccountActivation from "../pages/account-activation/AccountActivation";
import ForgotPassword from "../pages/forgot-password/ForgotPassword";
import Login from "../pages/login/Login";
import ResetPassword from "../pages/reset-password/ResetPassword";
import Signup from "../pages/signup/Signup";
import PublicGuard from "./PublicGuard";

const PublicRouter = [
    {
        element: <PublicGuard/>,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/reset-password",
                element: <ResetPassword />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "/account-activation",
                element: <AccountActivation />
            },
            {
                path: "/account-activation-with-code",
                element: <AccountActivationCode />
            },
        ]
    }
];

export default PublicRouter;
