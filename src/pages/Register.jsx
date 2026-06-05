import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API =
    "https://mern-backend-x2li.onrender.com/api/users/register";

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsLoading(true);

    try {
      await axios.post(API, {
        name,
        email,
        password,
      });

      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. Please log in." },
      });

    } catch (error) {
      console.log(error);

      setStatus(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-hero register-hero" aria-label="Registration overview">
        <div className="brand">
          <span className="brand-badge">MF</span>
          <span>MERN Flow</span>
        </div>
        <div className="auth-hero-copy">
          <p className="eyebrow">New access</p>
          <h1>Create your MongoDB-backed account.</h1>
          <p>
            Register through the backend API, then return to login and open your protected
            dashboard session.
          </p>
        </div>
        <div className="hero-stats">
          <div><strong>1</strong><span>Create account</span></div>
          <div><strong>2</strong><span>Log in</span></div>
          <div><strong>3</strong><span>Manage users</span></div>
        </div>
      </section>

      <section className="auth-panel" aria-label="Register">
        <div className="auth-card">
          <p className="eyebrow">Create account</p>
          <h2>Register</h2>
          <p className="muted">Your account will be saved through the existing MERN backend.</p>

          <form className="form-stack" onSubmit={handleRegister}>
            <label>
              Full name
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {status && <p className="form-message">{status}</p>}

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="switch-copy">
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
