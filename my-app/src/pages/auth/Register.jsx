import './Register.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmEmail: "",
    dob: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.email !== formData.confirmEmail) {
      setError("Emails do not match!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).href,
          data: {
            smart_garage: true,
            name: formData.name.trim(),
            dob: formData.dob || null,
            mobile: formData.mobile,
          },
        },
      });
      if (error) throw error;
      if (data.session) {
        navigate("/CoustomerDashboard");
      } else {
        setSuccess("Check your email to confirm your account. After confirming, return here to log in.");
      }
    } catch (err) {
      if (err.code === "over_email_send_rate_limit" || err.message === "email rate limit exceeded") {
        setError("The confirmation email limit has been reached. Please wait before trying again. If you already confirmed your account, use Login.");
      } else if (err.code === "email_address_not_authorized" || err.message === "Email address not authorized") {
        setError("Account confirmation email is unavailable for this address. Please contact the garage for help.");
      } else {
        setError(err.message || "Unable to create your account. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <h1>Create Account</h1>
          <p className="register-subtitle">Fill in your details to get started</p>
        </div>

        {error && <p className="error-msg" role="alert">❌ {error}</p>}
        {success && <p role="status">{success}</p>}

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">FULL NAME</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-mobile">MOBILE NUMBER</label>
              <input
                id="register-mobile"
                name="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-email">EMAIL</label>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-confirm-email">CONFIRM EMAIL</label>
              <input
                id="register-confirm-email"
                name="confirmEmail"
                type="email"
                placeholder="Re-enter your email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-password">PASSWORD</label>
              <input
                id="register-password"
                name="password"
                type="password"
                minLength={6}
                autoComplete="new-password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-dob">DATE OF BIRTH</label>
              <input
                id="register-dob"
                name="dob"
                type="date"
                max={new Date().toLocaleDateString('en-CA')}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className='Login-footer'>
            <Link to="/Login">Already have an account? Login</Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
