import "./Contact.css";
import { useState } from "react";
import { sendMessage } from "../../lib/garage";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendMessage(formData);
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.message || "Unable to send your message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="contact-page">

      {/* Header */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out to us anytime.</p>
      </div>

      <div className="contact-container">

        {/* Left - Contact Info */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Have a question or need help booking a service? Contact us and we'll get back to you shortly.</p>

          <div className="info-item">
            <div>
              <h4>Location</h4>
              <p>Chennai, Tamil Nadu, India</p>
            </div>
          </div>

          <div className="info-item">
            <div>
              <h4>Phone</h4>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="info-item">
            <div>
              <h4>Email</h4>
              <p>smartgarage@gmail.com</p>
            </div>
          </div>

          <div className="info-item">
            <div>
              <h4>Working Hours</h4>
              <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="contact-form-box">
          <h2>Send a Message</h2>
          {error && <p className="error-msg" role="alert">{error}</p>}

          {success && (
            <div className="success-msg">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              onChange={handleChange}
              value={formData.name}
              required
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              required
            />

            <label>Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              onChange={handleChange}
              value={formData.phone}
            />

            <label>Message</label>
            <textarea
              name="message"
              rows={5}
              placeholder="Write your message here..."
              onChange={handleChange}
              value={formData.message}
              required
            />

            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;
