
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const API = API_BASE_URL;

function Dashboard() {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadSlots = async () => {
      try {
        const response = await axios.get(
          `${API}/api/parking/slots`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 10000
          }
        );

        setSlots(response.data);
      } catch (error) {
        console.error("PARKING ERROR:", error);

        if (error.response?.status === 401 ||
            error.response?.status === 403) {
          setMessage("Your login session may have expired. Please log in again.");
        } else {
          setMessage("Unable to load parking slots. Check that the backend is running.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>🚗 Smart Parking Management System</h1>
          <p>Find and reserve your parking slot</p>
        </div>

        <div>
          <button onClick={() => navigate("/my-bookings")}>
            📋 My Bookings
          </button>

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {message && <div className="message">{message}</div>}

      <section>
        <h2>📍 Find Parking</h2>
        <p>Select an available parking slot to make a booking.</p>

        {loading ? (
          <p>Loading parking slots...</p>
        ) : slots.length === 0 ? (
          <p>No parking slots found. Add slots to your database first.</p>
        ) : (
          <div className="slot-container">
            {slots.map((slot) => (
              <div
                className={`slot ${slot.occupied ? "occupied" : "available"}`}
                key={slot.id}
              >
                <h3>🅿️ {slot.slotNumber}</h3>
                {slot.location && (
                  <p style={{ fontSize: "0.9rem", color: "#4f46e5", fontWeight: "600" }}>
                    📍 {slot.location.name} ({slot.location.city})
                  </p>
                )}
                <p>Vehicle: {slot.vehicleType}</p>
                <p>
                  Status: {slot.occupied ? "🔴 Occupied" : "🟢 Available"}
                </p>

                {!slot.occupied && (
                  <button onClick={() => navigate(`/book/${slot.id}`)}>
                    Book Slot
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
