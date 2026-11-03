import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { supabase } from "../../lib/supabase";

function Header({ user }) {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    navigate("/Login");
  };

const handleLogoClick = () => {
  navigate("/");
};

  const isAdmin = user && user.role === "admin";

  const getHomeLink = () => {
    if (!isLoggedIn) return "/";
    if (isAdmin) return "/admin";
    return "/CoustomerDashboard";
  };

  return (
    <header className="header">

      <div className="tit" onClick={handleLogoClick}>
        Smart Garage
      </div>

      <nav>
        <ul className="nav-links">
          {isLoggedIn && <li><Link to={getHomeLink()}>Home</Link></li>}
          <li><Link to="/Services">Services</Link></li>
          {isLoggedIn && !isAdmin && (
            <li><Link to="/Bookservice">Book Service</Link></li>
          )}
          {!isAdmin && <li><Link to="/Contact">Contact</Link></li>}
        </ul>
      </nav>

      <div className="buttons">
        {!isLoggedIn ? (
          <>
            <button className="login-btn" onClick={() => navigate("/Login")}>Login</button>
            <button className="register-btn" onClick={() => navigate("/Register")}>Register</button>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  );
}

export default Header;
