import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const navigate = useNavigate();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "https://mern-backend-x2li.onrender.com/api/users/login";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API, {
        email,
        password,
      });

      // save token
      localStorage.setItem("token", response.data.token);

      alert("Login Successful");

      console.log(response.data);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "100px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

console.log(email, password);
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(API, {
      email,
      password,
    });

    // save token
    localStorage.setItem("token", response.data.token);

    alert("Login Successful");

    // redirect to dashboard/home
    navigate("/dashboard");
   

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message || "Login failed"
    );
  }
};


export default Login;