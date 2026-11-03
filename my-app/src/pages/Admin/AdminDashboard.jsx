import "./AdminDashboard.css";
import { useState, useEffect } from "react";
import {
  readBookings, readCustomers, readServices, readDoorstepBookings, readMessages,
  updateBookingStatus, saveService, deleteService,
} from "../../lib/garage";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddService, setShowAddService] = useState(false);
  const [editService, setEditService] = useState(null);
  const [newService, setNewService] = useState({
    name: "", description: "", price: "", duration: ""
  });
  const [doorstepOrders, setDoorstepOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([readBookings(), readCustomers(), readServices(), readDoorstepBookings(), readMessages()])
      .then(([allBookings, allCustomers, allServices, doorstep, allMessages]) => {
        if (!active) return;
        setBookings(allBookings);
        setCustomers(allCustomers);
        setServices(allServices);
        setDoorstepOrders(doorstep);
        setMessages(allMessages);
      })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const fetchBookings = async () => {
    try {
      setBookings(await readBookings());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchServices = async () => {
    try {
      setServices(await readServices());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDoorstepOrders = async () => {
    try {
      setDoorstepOrders(await readDoorstepBookings());
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await updateBookingStatus(id, status);
      fetchBookings();
      fetchDoorstepOrders();
      alert("Status updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccept = async (id) => {
    try {
      setError("");
      await updateBookingStatus(id, "inprogress");
      alert("Booking accepted");
      fetchBookings();
      fetchDoorstepOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        setError("");
        await updateBookingStatus(id, "rejected");
        alert("Booking rejected");
        fetchBookings();
        fetchDoorstepOrders();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddService = async () => {
    try {
      setError("");
      await saveService(newService);
      alert("Service added successfully");
      setShowAddService(false);
      setNewService({ name: "", description: "", price: "", duration: "" });
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditService = async () => {
    try {
      setError("");
      await saveService(editService, editService.id);
      alert("Service updated successfully");
      setEditService(null);
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        setError("");
        await deleteService(id);
        alert("Service deleted");
        fetchServices();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Stats
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const inProgress = bookings.filter(b => b.status === "inprogress").length;
  const completed = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="admin-dashboard">
      {error && <p className="error-msg" role="alert">{error}</p>}

      {/* Welcome */}
      <div className="admin-welcome">
        <h2>Admin Dashboard</h2>
        <p>Manage all bookings, customers and services</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-card">
          <h3>Total Bookings</h3>
          <p className="card-number">{total}</p>
        </div>
        <div className="admin-card">
          <h3>Pending</h3>
          <p className="card-number pending">{pending}</p>
        </div>
        <div className="admin-card">
          <h3>In Progress</h3>
          <p className="card-number progress">{inProgress}</p>
        </div>
        <div className="admin-card">
          <h3>Completed</h3>
          <p className="card-number completed">{completed}</p>
        </div>
        <div className="admin-card">
          <h3>Total Customers</h3>
          <p className="card-number">{customers.length}</p>
        </div>
        <div className="admin-card">
          <h3>New Messages</h3>
          <p className="card-number" style={{color: "#2F80ED"}}>{messages.length}</p>
        </div>
      </div>

      {/* New Booking Requests */}
      <div className="admin-section">
        <div className="section-header">
          <h3>New Booking Requests</h3>
          <span className="notification-badge">{pending} Pending</span>
        </div>
        {bookings.filter(b => b.status === "pending").length === 0 ? (
          <p>No new booking requests</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date</th>
                <th>Pickup</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.filter(b => b.status === "pending").map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.customer_name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.vehicle_number}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date ? booking.date.toString().split("T")[0] : "-"}</td>
                  <td>{booking.pickup_type}</td>
                  <td>
                    <button className="accept-btn" onClick={() => handleAccept(booking.id)}>Accept</button>
                    <button className="reject-btn" onClick={() => handleReject(booking.id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Bookings */}
      <div className="admin-section">
        <h3>All Bookings</h3>
        {loading ? <p>Loading...</p> : bookings.length === 0 ? <p>No bookings yet</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.customer_name}</td>
                  <td>{booking.vehicle_number}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date ? booking.date.toString().split("T")[0] : "-"}</td>
                  <td>
                    <span className={`badge ${booking.status}`}>
                      {booking.status === "inprogress" ? "In Progress" : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="inprogress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Doorstep Orders */}
      <div className="admin-section">
        <h3>Doorstep Pickup Orders</h3>
        {doorstepOrders.length === 0 ? (
          <p>No doorstep orders yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Address</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {doorstepOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>
                  <td>{order.vehicle_number}</td>
                  <td>{order.service}</td>
                  <td>{order.address}</td>
                  <td>{order.date ? order.date.toString().split("T")[0] : "-"}</td>
                  <td>
                    <span className={`badge ${order.status}`}>
                      {order.status === "inprogress" ? "In Progress" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Customers Table */}
      <div className="admin-section">
        <h3>Registered Customers</h3>
        {customers.length === 0 ? <p>No customers yet</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.created_at ? customer.created_at.toString().split("T")[0] : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Contact Messages */}
      <div className="admin-section">
        <h3>Contact Messages</h3>
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.phone}</td>
                  <td>{msg.message}</td>
                  <td>{msg.created_at ? msg.created_at.toString().split("T")[0] : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Services Section */}
      <div className="admin-section">
        <div className="section-header">
          <h3>Services</h3>
          <button className="add-btn" onClick={() => setShowAddService(true)}>+ Add Service</button>
        </div>

        {showAddService && (
          <div className="service-form">
            <h4>Add New Service</h4>
            <input placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
            <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
            <input placeholder="Price (e.g. 499)" type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
            <input placeholder="Duration (e.g. 1 hour)" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />
            <div className="form-btns">
              <button className="confirm-btn" onClick={handleAddService}>Add</button>
              <button className="back-btn" onClick={() => setShowAddService(false)}>Cancel</button>
            </div>
          </div>
        )}

        {editService && (
          <div className="service-form">
            <h4>Edit Service</h4>
            <input placeholder="Service Name" value={editService.name} onChange={(e) => setEditService({ ...editService, name: e.target.value })} />
            <input placeholder="Description" value={editService.description} onChange={(e) => setEditService({ ...editService, description: e.target.value })} />
            <input placeholder="Price" type="number" value={editService.price} onChange={(e) => setEditService({ ...editService, price: e.target.value })} />
            <input placeholder="Duration" value={editService.duration} onChange={(e) => setEditService({ ...editService, duration: e.target.value })} />
            <div className="form-btns">
              <button className="confirm-btn" onClick={handleEditService}>Update</button>
              <button className="back-btn" onClick={() => setEditService(null)}>Cancel</button>
            </div>
          </div>
        )}

        {services.length === 0 ? <p>No services added yet</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>₹{service.price}</td>
                  <td>{service.duration}</td>
                  <td>
                    <button className="edit-btn" onClick={() => setEditService(service)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteService(service.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
