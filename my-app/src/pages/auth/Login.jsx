import './Login.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBg from "../../assets/login.jpg";
import { supabase } from "../../lib/supabase";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), password,
      });
      if (error) throw error;
      if (data.user) {
        if (data.user.app_metadata?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/CoustomerDashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="login-card">
        <h1>LOGIN HERE</h1>
        <p className="login-subtitle">Enter your details to continue</p>

        {error && <p className="error-msg">❌ {error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">USER ID / EMAIL</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" autoComplete="email" required />

          <label htmlFor="password" className="p">PASSWORD</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />

          <button className="login" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-footer">
            <Link to="/Register">don't have an account?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
