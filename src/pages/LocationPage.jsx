import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function LocationPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  const API = "https://smart-parking-backend-gtsr.onrender.com";

  const getConfig = () => {

    const token =
      localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadLocation();
    loadSlots();

  }, [id]);

  const loadLocation = async () => {

    try {

      const response = await axios.get(
        `${API}/api/locations`,
        getConfig()
      );

      const selected =
        response.data.find(
          (item) =>
            item.id === Number(id)
        );

      if (selected) {
        setLocation(selected);
      } else {
        setMessage(
          "Parking location not found"
        );
      }

    } catch (error) {

      console.log(
        "LOCATION ERROR:",
        error
      );

      setMessage(
        "Unable to load location"
      );
    }
  };

  const loadSlots = async () => {

    try {

      const response = await axios.get(
        `${API}/api/parking/location/${id}`,
        getConfig()
      );

      setSlots(response.data);

    } catch (error) {

      console.log(
        "SLOT ERROR:",
        error
      );

      setMessage(
        "Unable to load parking slots"
      );
    }
  };

  const bookSlot = (slotId) => {

    navigate(`/book/${slotId}`);

  };

  const availableSlots =
    slots.filter(
      (slot) => !slot.occupied
    ).length;

  const occupiedSlots =
    slots.filter(
      (slot) => slot.occupied
    ).length;

  return (
    <div className="app">

      <header>

        <div>

          <h1>
            🚗 Smart Parking
          </h1>

          <p>
            Parking Location
          </p>

        </div>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem(
              "token"
            );

            navigate("/login");
          }}
        >
          Logout
        </button>

      </header>

      <section>

        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Locations
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {location && (

          <>
            <h2>
              📍 {location.name}
            </h2>

            <p>
              📌 {location.address}
            </p>

            <p>
              🌆 {location.city}
            </p>

            <div className="availability-summary">

              <div className="summary-card total">

                <h3>
                  {slots.length}
                </h3>

                <p>
                  Total Slots
                </p>

              </div>

              <div className="summary-card available-count">

                <h3>
                  {availableSlots}
                </h3>

                <p>
                  🟢 Available
                </p>

              </div>

              <div className="summary-card occupied-count">

                <h3>
                  {occupiedSlots}
                </h3>

                <p>
                  🔴 Occupied
                </p>

              </div>

            </div>

            <h2>
              🅿️ Parking Slots
            </h2>

            <div className="slot-container">

              {slots.length === 0 ? (

                <p>
                  No parking slots found.
                </p>

              ) : (

                slots.map((slot) => (

                  <div
                    className={`slot ${
                      slot.occupied
                        ? "occupied"
                        : "available"
                    }`}
                    key={slot.id}
                  >

                    <h3>
                      {slot.slotNumber}
                    </h3>

                    <p>
                      🚗 Vehicle:{" "}
                      {slot.vehicleType}
                    </p>

                    <p>
                      Status:{" "}
                      {slot.occupied
                        ? "🔴 Occupied"
                        : "🟢 Available"}
                    </p>

                    {!slot.occupied && (

                      <button
                        onClick={() =>
                          bookSlot(slot.id)
                        }
                      >
                        Book Slot
                      </button>

                    )}

                  </div>

                ))

              )}

            </div>

          </>

        )}

      </section>

    </div>
  );
}

export default LocationPage;