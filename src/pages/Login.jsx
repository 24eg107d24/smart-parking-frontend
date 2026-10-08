import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        loginData
      );

      if (
        response.data ===
        "Invalid email or password"
      ) {
        setMessage("❌ Wrong email or password");
        return;
      }

      localStorage.setItem(
        "token",
        response.data
      );

      setMessage("✅ Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      setMessage(
        "❌ Wrong email or password"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          🚗 Smart Parking
        </h1>

        <h2>
          Login
        </h2>

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

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?
        </p>

        <Link to="/register">
          <button className="secondary">
            Create Account
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Login;