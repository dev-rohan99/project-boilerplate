import DefaultLayout from "../layouts/default-layout/DefaultLayout";
import Home from "../pages/home/Home";
import UserProfile from "../pages/user-profile/UserProfile";
import PrivateGuard from "./PrivateGuard";


const privateRouter = [
    {
        element: <DefaultLayout/>,
        children: [
            {
                element: <PrivateGuard/>,
                children: [
                    {
                        path: "/",
                        element: <Home />
                    },
                    {
                        path: "/profile-update",
                        element: <UserProfile />
                    },
                ]
            }
        ]
    }
];

export default privateRouter;
