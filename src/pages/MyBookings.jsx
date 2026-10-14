import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");

  const API = API_BASE_URL;

  const getConfig = () => ({
    headers: {
      Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
  });

  useEffect(() => {

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const config = getConfig();

      const bookingsResponse =
        await axios.get(
          `${API}/api/bookings/my`,
          config
        );

      const slotsResponse =
        await axios.get(
          `${API}/api/parking/slots`,
          config
        );

      const locationsResponse =
        await axios.get(
          `${API}/api/locations`,
          config
        );

      setBookings(bookingsResponse.data);
      setSlots(slotsResponse.data);
      setLocations(locationsResponse.data);

    } catch (error) {

      console.log(
        "BOOKINGS ERROR:",
        error
      );

      setMessage(
        "❌ Unable to load your bookings"
      );
    }
  };

  const getSlot = (slotId) => {

    return slots.find(
      (slot) => slot.id === slotId
    );
  };

  const getLocation = (slotId) => {

    const slot = getSlot(slotId);

    if (!slot) {
      return null;
    }

    return locations.find(
      (location) =>
        location.id === slot.location?.id
    );
  };

  const formatDateTime = (dateTime) => {

    if (!dateTime) {
      return "Not available";
    }

    return new Date(dateTime).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  return (
    <div className="app">

      <header>

        <div>

          <h1>
            🚗 Smart Parking
          </h1>

          <p>
            My Bookings
          </p>

        </div>

        <button
          className="logout"
          onClick={() => {

            localStorage.removeItem("token");

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
          ← Back to Dashboard
        </button>

        <h2>
          📋 My Parking Bookings
        </h2>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {bookings.length === 0 ? (

          <div className="empty-bookings">

            <h3>
              No bookings found
            </h3>

            <p>
              You have not booked any parking
              slots yet.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Find Parking
            </button>

          </div>

        ) : (

          <div className="booking-list">

            {bookings.map((booking) => {

              const slot =
                getSlot(booking.slotId);

              const location =
                getLocation(booking.slotId);

              return (

                <div
                  className="booking-history-card"
                  key={booking.id}
                >

                  <div className="booking-header">

                    <h3>
                      🅿️ Booking #{booking.id}
                    </h3>

                    <span className="confirmed">
                      {booking.status}
                    </span>

                  </div>

                  <div className="booking-details">

                    <p>
                      <strong>
                        📍 Parking:
                      </strong>{" "}
                      {location?.name ||
                        "Parking Location"}
                    </p>

                    <p>
                      <strong>
                        📌 Address:
                      </strong>{" "}
                      {location?.address ||
                        "Not available"}
                    </p>

                    <p>
                      <strong>
                        🅿️ Slot:
                      </strong>{" "}
                      {slot?.slotNumber ||
                        booking.slotId}
                    </p>

                    <p>
                      <strong>
                        🚗 Vehicle:
                      </strong>{" "}
                      {slot?.vehicleType ||
                        "Not available"}
                    </p>

                    <p>
                      <strong>
                        📅 Start:
                      </strong>{" "}
                      {formatDateTime(
                        booking.startTime
                      )}
                    </p>

                    <p>
                      <strong>
                        🏁 End:
                      </strong>{" "}
                      {formatDateTime(
                        booking.endTime
                      )}
                    </p>

                    <p>
                      <strong>
                        ⏱️ Duration:
                      </strong>{" "}
                      {booking.durationHours} hour(s)
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default MyBookings;