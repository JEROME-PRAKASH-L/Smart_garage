import "./Service.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { readServices } from "../../lib/garage";

function Services({ user }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let active = true;
    readServices()
      .then(data => { if (active) setServices(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);


  return (
    <div className="services-page">

      <div className="services-header">
        <h1>Our Services</h1>
        <p>Quality vehicle services at affordable prices</p>
      </div>

      {error && <p className="error-msg" role="alert">{error}</p>}

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px" }}>Loading services...</p>
      ) : services.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px" }}>No services available yet</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <h3>{service.name}</h3>
              <p className="service-desc">{service.description}</p>
              <div className="service-info">
                <span className="price">₹{service.price}</span>
                <span className="time">⏱ {service.duration}</span>
              </div>
              {!isAdmin && <button
                  className="book-now-btn"
                  onClick={() => navigate("/Bookservice")}
                >
                  Book Now
                </button>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Services;
