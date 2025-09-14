// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function ProtectedRoute() {
  const user = useAppSelector((state) => state.user.user);

  if (user) {
    return <Outlet />;   // 👈 Router ke children render honge
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
