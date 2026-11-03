import "./Home.css";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline, IoTimeOutline, IoShieldCheckmarkOutline, IoCardOutline, IoThumbsUpOutline } from "react-icons/io5";
import heroImg from "../../assets/home.jpg";
function Home({ user }) {
  const navigate = useNavigate();
  const isAdmin = user && user.role === "admin";

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `linear-gradient(to right, rgba(10,14,26,0.85), rgba(11,35,66,0.75)), url(${heroImg})` }}>
        <div className="hero-text">
          <p className="welcome-tag">Welcome to</p>
          <h1>SMART <span>GARAGE</span></h1>
          <h3>Professional Car Repair & Vehicle Maintenance Services</h3>
          <p className="hero-desc">
            Book your vehicle service online, track repair progress,
            and enjoy hassle-free maintenance with experienced mechanics.
          </p>
          {!isAdmin && (
            <button className="book-btn" onClick={() => navigate("/Bookservice")}>
              <IoCalendarOutline size={20} />
              Book a Service
            </button>
          )}
        </div>
      </section>

      {/* Features Row */}
      <section className="features">
        <div className="feature-item">
          <div>
            <h3>Expert Mechanics</h3>
            <p>Certified professionals for all types of vehicle repairs.</p>
          </div>
        </div>
        <div className="feature-item">
          <div>
            <h3>Easy Booking</h3>
            <p>Schedule your vehicle service in just a few clicks.</p>
          </div>
        </div>
        <div className="feature-item">
          <div>
            <h3>Quality Service</h3>
            <p>Reliable maintenance using genuine spare parts.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <div className="why-us-text">
          <h2>Why Choose Smart Garage?</h2>
          <div className="underline"></div>
          <ul>
            <li>✔ Experienced Mechanics</li>
            <li>✔ Genuine Spare Parts</li>
            <li>✔ Affordable Pricing</li>
            <li>✔ Fast Vehicle Delivery</li>
            <li>✔ Online Service Booking</li>
            <li>✔ Customer Satisfaction</li>
          </ul>
          <button className="book-btn" onClick={() => navigate("/Services")}>
            View Our Services
          </button>
        </div>
      </section>

      {/* Bottom Stats Bar */}
      <section className="bottom-box">
        <div className="stat">
          <div className="icon-circle small">
            <IoTimeOutline size={22} />
          </div>
          <div>
            <h4>Save Time</h4>
            <p>Quick & easy online booking</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="stat">
          <div className="icon-circle small">
            <IoShieldCheckmarkOutline size={22} />
          </div>
          <div>
            <h4>Trusted Service</h4>
            <p>Quality service you can rely on</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="stat">
          <div className="icon-circle small">
            <IoCardOutline size={22} />
          </div>
          <div>
            <h4>Best Price</h4>
            <p>Affordable pricing guaranteed</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="stat">
          <div className="icon-circle small">
            <IoThumbsUpOutline size={22} />
          </div>
          <div>
            <h4>Happy Customers</h4>
            <p>We care about your satisfaction</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
