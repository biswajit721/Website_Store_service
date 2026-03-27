import { Navigate } from "react-router-dom";

export default function AuthRedirect({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in → allow login/register
  if (!token || !role) {
    return children;
  }

  // already logged in → redirect by role
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "user") {
    return <Navigate to="/" replace />;
  }

  return children;
}
