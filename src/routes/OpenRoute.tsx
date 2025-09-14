// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function OpenRoute() {
  const user = useAppSelector((state) => state.user.user);

  if (user===null) {
    return <Outlet />;   // 👈 Router ke children render honge
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}

export default OpenRoute;
