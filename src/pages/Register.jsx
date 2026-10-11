import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const register = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "https://smart-parking-backend-gtsr.onrender.com/api/auth/register",
        registerData
      );

      setMessage(response.data);

      if (
        response.data ===
        "Registration successful"
      ) {

        setTimeout(() => {
          navigate("/login");
        }, 1000);

      }

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );

      setMessage(
        "❌ Registration failed"
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
          Create Account
        </h2>

        {message && (
          <div className="message">
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

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?
        </p>

        <Link to="/login">
          <button className="secondary">
            Back to Login
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Register;