
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginData
      );

      const token =
        typeof response.data === "string"
          ? response.data
          : response.data?.token;

      if (
        !token ||
        token === "Invalid email or password" ||
        token === "Email already registered"
      ) {
        setMessage("❌ Invalid email or password.");
        return;
      }

      localStorage.setItem("token", token);
      setMessage("✅ Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        setMessage(
          `❌ Login failed (${error.response.status}). ${
            typeof error.response.data === "string"
              ? error.response.data
              : "Please check your credentials."
          }`
        );
      } else {
        setMessage(
          "❌ Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🚗 Smart Parking</h1>
        <h2>Login</h2>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                email: e.target.value
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value
              })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>Don't have an account?</p>

        <Link to="/register">
          <button type="button" className="secondary">
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
