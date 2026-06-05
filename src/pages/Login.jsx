import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API = "https://mern-backend-x2li.onrender.com/api/users/login";

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsLoading(true);

    try {
      const response = await axios.post(API, {
        email,
        password,
      });

      // save token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));

      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.log(error);

      setStatus(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-hero" aria-label="Product overview">
        <div className="brand">
          <span className="brand-badge">MF</span>
          <span>MERN Flow</span>
        </div>
        <div className="auth-hero-copy">
          <p className="eyebrow">Secure workspace</p>
          <h1>Manage users from a focused dashboard.</h1>
          <p>
            Sign in with your existing MongoDB-backed account and continue directly into the
            user management workspace.
          </p>
        </div>
        <div className="hero-stats">
          <div><strong>API</strong><span>Render backend</span></div>
          <div><strong>DB</strong><span>MongoDB connected</span></div>
          <div><strong>JWT</strong><span>Protected access</span></div>
        </div>
      </section>

      <section className="auth-panel" aria-label="Login">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h2>Log in</h2>
          <p className="muted">Use the credentials you created in the original application.</p>
          {location.state?.message && <p className="form-message success">{location.state.message}</p>}

          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {status && <p className="form-message">{status}</p>}

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <p className="switch-copy">
            Need an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
