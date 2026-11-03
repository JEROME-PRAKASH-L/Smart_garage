import './CoustomerDashboard.css'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { readMyBookings } from "../../lib/garage";

function CustomerDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const userName = user ? user.name : "Customer";

  useEffect(() => {
    let active = true;
    readMyBookings(user.id)
      .then(data => { if (active) setBookings(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user.id]);


  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const inProgress = bookings.filter(b => b.status === "inprogress").length;
  const completed = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="dashboard">


      <div className="welcome-box">
        <h2>Welcome back, {userName}!</h2>
        <p>Here's a summary of your vehicle services</p>
      </div>


      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number pending">{pending}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number progress">{inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number completed">{completed}</p>
        </div>
      </div>


      <div className="section">
        <h3>Recent Bookings</h3>
        {error && <p className="error-msg" role="alert">{error}</p>}

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found. Book a service to get started!</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Pickup</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.service}</td>
                  <td>{booking.vehicle_number}</td>
                  <td>{booking.date ? booking.date.toString().split("T")[0] : "-"}</td>
                  <td>{booking.time_slot}</td>
                  <td>{booking.pickup_type}</td>
                  <td>
                    <span className={`badge ${booking.status}`}>
                      {booking.status === "inprogress" ? "In Progress" : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      <div className="section">
        <h3>Quick Actions</h3>
        <div className="actions-row">
          <Link to="/Bookservice" className="action-btn">Book a Service</Link>
          <Link to="/Contact" className="action-btn">Contact Us</Link>
        </div>
      </div>

    </div>
  );
}

export default CustomerDashboard;
