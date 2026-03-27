import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./util/layouts/PublieLayout";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Home from "./pages/Home";
import Service from "./pages/Service";
import Portfolio from "./pages/Portfolio";

import ServiceDetails from "./pages/ServiceDetails";
import AuthRedirect from "./middleware/AuthMiddleware";

import Register from "./pages/auth/Register";
import AdminGuard from "./middleware/AdminGuard";
import AdminLayout from "./util/layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/dashboard/AdminDashboard";
// import AdminOrders from "./pages/Admin/dashboard/OrdersManagement";
import AdminService from "./pages/Admin/dashboard/ServiceManagement";
import AdminMeeting from "./pages/Admin/dashboard/MeetingManagement";
import AdminCategory from "./pages/Admin/dashboard/CategoryManagement";
import Login from "./pages/auth/Login";
import Contact from "./pages/auth/Contact";
import { Toaster } from "sonner";
import UsersManagement from "./pages/Admin/dashboard/UsersManagement";
import AdminScheduleMeeting from "./pages/Admin/dashboard/ScheduleMeeting";
import ServiceEditPage from "./pages/Admin/dashboard/Serviceeditpage";
import AdminProfile from "./pages/Admin/dashboard/AdminProfile";
import UserProfile from "./pages/Userprofile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========= PUBLIC LAYOUT ========= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Service />
              </ProtectedRoute>
            }
          />

          <Route path="/contact" element={<Contact />} />

          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/service-details"
            element={
              <ProtectedRoute>
                <ServiceDetails />
              </ProtectedRoute>
            }
          />

          {/* login/register guarded */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />

          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
        </Route>

        {/* ========= ADMIN LAYOUT ========= */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminService />} />
          <Route path="users" element={<UsersManagement />} />
          {/* <Route path="orders" element={<AdminOrders />} /> */}
          <Route path="meetings" element={<AdminMeeting />} />
          <Route path="scheduling" element={<AdminScheduleMeeting />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="services/edit" element={<ServiceEditPage />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
