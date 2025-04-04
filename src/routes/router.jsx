import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Chat from "../pages/chat";
import Layout from "../layout";
import Auth from "../pages/auth";
import ProtectedRoute from "../routes/protectedRoute";

const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <App /> },
        { path: "chat/:otherUserId", element: <Chat /> },
      ],
    },
    { path: "auth", element: <Auth /> },
  ]);
  

export default router;
