import { useEffect, useState } from "react";
import { supabase, sessionUser } from "./lib/supabase";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/Customer/Contact";
import Service from "./pages/Services/Service";
import Bookservice from "./pages/Services/Bookservice";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const ProtectedRoute = ({ user, adminOnly = false, children }) => {
  if (!user) {
    return <Navigate to="/Login" />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/CoustomerDashboard" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(sessionUser(session));
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <p role="status">Loading your account...</p>;

  return (
    <>
      <Header user={user} />

      {/* Login and Register - NO padding */}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        {/* All other pages - WITH padding */}
        <Route path="/*" element={
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Services" element={<Service user={user} />} />
              <Route path="/Bookservice" element={
                <ProtectedRoute user={user}>
                  <Bookservice user={user} />
                </ProtectedRoute>
              } />
              <Route path="/CoustomerDashboard" element={
                <ProtectedRoute user={user}>
                  <CustomerDashboard user={user} />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute user={user} adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        } />
      </Routes>

      <Footer user={user} />
    </>
  );
}

export default App;
