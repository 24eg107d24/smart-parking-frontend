import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {

  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");

  const API = "http://localhost:8080";

  const getConfig = () => {

    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadLocations();

  }, []);

  const loadLocations = async () => {

    try {

      const response = await axios.get(
        `${API}/api/locations`,
        getConfig()
      );

      setLocations(response.data);

    } catch (error) {

      console.log(
        "LOCATION ERROR:",
        error
      );

      setMessage(
        "❌ Unable to load parking locations"
      );
    }
  };

  const openLocation = (locationId) => {

    navigate(`/location/${locationId}`);

  };

  const openMyBookings = () => {

    navigate("/my-bookings");

  };

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (
    <div className="app">

      <header>

        <div>

          <h1>
            🚗 Smart Parking
            Management System
          </h1>

          <p>
            Find and reserve your parking slot
          </p>

        </div>

        <div>

          <button
            onClick={openMyBookings}
          >
            📋 My Bookings
          </button>

          <button
            className="logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <section>

        <h2>
          📍 Find Parking
        </h2>

        <p>
          Select a parking location to view
          available parking slots.
        </p>

        <div className="location-container">

          {locations.length === 0 ? (

            <p>
              Loading parking locations...
            </p>

          ) : (

            locations.map((location) => (

              <div
                className="location-card"
                key={location.id}
              >

                <h3>
                  📍 {location.name}
                </h3>

                <p>
                  📌 {location.address}
                </p>

                <p>
                  🌆 {location.city}
                </p>

                <p>
                  🅿️ Total Slots:{" "}
                  {location.totalSlots}
                </p>

                <button
                  onClick={() =>
                    openLocation(location.id)
                  }
                >
                  View Parking
                </button>

              </div>

            ))

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;