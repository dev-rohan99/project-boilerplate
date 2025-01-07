import { createBrowserRouter } from "react-router-dom"
import PublicRouter from "./PublicRouter"
import PrivateRouter from "./PrivateRouter"


// create browser router
const router = createBrowserRouter([...PublicRouter, ...PrivateRouter])

export default router;
