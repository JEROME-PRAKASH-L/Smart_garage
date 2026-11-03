import "./Footer.css";
import { Link} from "react-router-dom";

function Footer({ user }) {
  const isLoggedIn = Boolean(user);
  const isAdmin = user && user.role === "admin";

  const getHomeLink = () => {
    if (!isLoggedIn) return "/";
    if (isAdmin) return "/admin";
    return "/CoustomerDashboard";
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h2> Smart Garage</h2>
          <p>
            Your trusted partner for vehicle servicing and repairs.
            Book your service anytime, anywhere.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            {isLoggedIn && <li><Link to={getHomeLink()}>Home</Link></li>}
            <li><Link to="/Services">Services</Link></li>
            {!isAdmin && <li><Link to="/Bookservice">Book Service</Link></li>}
            {!isAdmin && <li><Link to="/Contact">Contact</Link></li>}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>Chennai, Tamil Nadu</p>
          <p>+91 9876543210</p>
          <p>✉ smartgarage@gmail.com</p>
        </div>

      </div>

      <hr />

      <div className="copyright">
        <p>© 2026 Smart Garage. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
