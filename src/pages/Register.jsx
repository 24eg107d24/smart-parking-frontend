
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = API_BASE_URL;

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/api/auth/register`,
        registerData,
        { timeout: 15000 }
      );

      const result =
        typeof response.data === "string"
          ? response.data
          : response.data?.message || "Registration completed.";

      setMessage(result);

      if (result.toLowerCase().includes("successful")) {
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.code === "ECONNABORTED") {
        setMessage("Request timed out. Check that the backend is running.");
      } else if (error.response) {
        const data = error.response.data;
        setMessage(
          `Registration failed (${error.response.status}): ${
            typeof data === "string"
              ? data
              : data?.message || "Server error"
          }`
        );
      } else {
        setMessage(
          "Cannot connect to backend. Make sure Spring Boot is running on port 8080."
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
        <h2>Create Account</h2>

        {message && (
          <div className="message" role="status">
            {message}
          </div>
        )}

        <form onSubmit={register}>
          <input
            type="text"
            placeholder="Name"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                name: e.target.value
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                email: e.target.value
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password: e.target.value
              })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>Already have an account?</p>

        <Link to="/login">
          <button type="button" className="secondary">
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Register;
