import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BookingPage() {

  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const [bookingData, setBookingData] = useState({
    date: "",
    hour: "10",
    minute: "00",
    period: "AM",
    durationHours: "1"
  });

  const API = "https://smart-parking-backend-gtsr.onrender.com";

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

    loadSlot();
    loadBookings();

  }, [slotId]);

  const loadSlot = async () => {

    try {

      const response = await axios.get(
        `${API}/api/parking/slots`,
        getConfig()
      );

      const selectedSlot =
        response.data.find(
          (item) =>
            item.id === Number(slotId)
        );

      if (!selectedSlot) {
        setMessage(
          "❌ Parking slot not found"
        );
        return;
      }

      setSlot(selectedSlot);

    } catch (error) {

      console.log("SLOT ERROR:", error);

      setMessage(
        "❌ Unable to load parking slot"
      );
    }
  };

  const loadBookings = async () => {

    try {

      const response = await axios.get(
        `${API}/api/bookings`,
        getConfig()
      );

      const slotBookings =
        response.data.filter(
          (booking) =>
            booking.slotId === Number(slotId)
        );

      setBookings(slotBookings);

    } catch (error) {

      console.log(
        "BOOKING LOAD ERROR:",
        error
      );
    }
  };

  const convertTo24Hour = () => {

    let hour =
      Number(bookingData.hour);

    if (bookingData.period === "AM") {

      if (hour === 12) {
        hour = 0;
      }

    } else {

      if (hour !== 12) {
        hour += 12;
      }

    }

    return `${String(hour).padStart(2, "0")}:${bookingData.minute}`;
  };

  const getStartDateTime = () => {

    if (!bookingData.date) {
      return null;
    }

    return new Date(
      `${bookingData.date}T${convertTo24Hour()}`
    );
  };

  const isPastTime = () => {

    const start =
      getStartDateTime();

    if (!start) {
      return false;
    }

    return start < new Date();
  };

  const getEndTime = () => {

    const start =
      getStartDateTime();

    if (!start) {
      return "";
    }

    const duration =
      Number(
        bookingData.durationHours
      );

    const end =
      new Date(
        start.getTime() +
        duration * 60 * 60 * 1000
      );

    return end.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  const isTimeAvailable = () => {

    const start =
      getStartDateTime();

    if (!start) {
      return true;
    }

    // Prevent booking a past time
    if (isPastTime()) {
      return false;
    }

    const end =
      new Date(
        start.getTime() +
        Number(
          bookingData.durationHours
        ) *
        60 *
        60 *
        1000
      );

    return !bookings.some(
      (booking) => {

        if (
          !booking.startTime ||
          !booking.endTime
        ) {
          return false;
        }

        const existingStart =
          new Date(
            booking.startTime
          );

        const existingEnd =
          new Date(
            booking.endTime
          );

        return (
          start < existingEnd &&
          end > existingStart
        );
      }
    );
  };

  const confirmBooking = async (e) => {

    e.preventDefault();

    setMessage("");

    if (!bookingData.date) {

      setMessage(
        "❌ Please select a booking date"
      );

      return;
    }

    if (isPastTime()) {

      setMessage(
        "❌ The selected time has already passed"
      );

      return;
    }

    if (!isTimeAvailable()) {

      setMessage(
        "❌ This slot is already booked for the selected time"
      );

      return;
    }

    try {

      const startDateTime =
        `${bookingData.date}T${convertTo24Hour()}`;

      await axios.post(
        `${API}/api/bookings?slotId=${slotId}&startTime=${encodeURIComponent(
          startDateTime
        )}&durationHours=${bookingData.durationHours}`,
        {},
        getConfig()
      );

      alert(
        "✅ Parking slot booked successfully!"
      );

      navigate(
        `/location/${slot.location.id}`
      );

    } catch (error) {

      console.log(
        "BOOKING ERROR:",
        error
      );

      setMessage(
        error.response?.data ||
        "❌ Unable to book this slot"
      );
    }
  };

  if (!slot) {

    return (
      <div className="app">

        <section>

          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h2>
            {message ||
              "Loading parking slot..."}
          </h2>

        </section>

      </div>
    );
  }

  return (
    <div className="app">

      <header>

        <div>

          <h1>
            🚗 Smart Parking
          </h1>

          <p>
            Book Your Parking Slot
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

      <section className="booking-page">

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Parking Slots
        </button>

        <div className="booking-card">

          <h2>
            🅿️ Book Parking Slot
          </h2>

          <div className="booking-info">

            <p>
              <strong>
                📍 Parking Location:
              </strong>
            </p>

            <p>
              {slot.location?.name}
            </p>

            <p>
              <strong>
                🅿️ Parking Slot:
              </strong>
            </p>

            <p>
              {slot.slotNumber}
            </p>

            <p>
              <strong>
                🚗 Vehicle Type:
              </strong>
            </p>

            <p>
              {slot.vehicleType}
            </p>

          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={confirmBooking}>

            <label>
              📅 Booking Date
            </label>

            <input
              type="date"
              value={bookingData.date}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setBookingData({
                  ...bookingData,
                  date: e.target.value
                })
              }
              required
            />

            <label>
              🕐 Booking Time
            </label>

            <div className="time-selection">

              <select
                value={bookingData.hour}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    hour: e.target.value
                  })
                }
              >

                {Array.from(
                  { length: 12 },
                  (_, i) => {

                    const hour =
                      String(i + 1);

                    return (
                      <option
                        key={hour}
                        value={hour}
                      >
                        {hour}
                      </option>
                    );

                  }
                )}

              </select>

              <span>:</span>

              <select
                value={bookingData.minute}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    minute: e.target.value
                  })
                }
              >

                <option value="00">
                  00
                </option>

                <option value="15">
                  15
                </option>

                <option value="30">
                  30
                </option>

                <option value="45">
                  45
                </option>

              </select>

              <select
                value={bookingData.period}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    period: e.target.value
                  })
                }
              >

                <option value="AM">
                  AM
                </option>

                <option value="PM">
                  PM
                </option>

              </select>

            </div>

            <label>
              ⏱️ How long will you park?
            </label>

            <select
              value={bookingData.durationHours}
              onChange={(e) =>
                setBookingData({
                  ...bookingData,
                  durationHours:
                    e.target.value
                })
              }
            >

              <option value="1">
                1 Hour
              </option>

              <option value="2">
                2 Hours
              </option>

              <option value="3">
                3 Hours
              </option>

              <option value="4">
                4 Hours
              </option>

              <option value="5">
                5 Hours
              </option>

              <option value="6">
                6 Hours
              </option>

              <option value="8">
                8 Hours
              </option>

              <option value="12">
                12 Hours
              </option>

            </select>

            {bookingData.date && (

              <div className="booking-summary">

                <h3>
                  📋 Booking Summary
                </h3>

                <p>
                  <strong>
                    Slot:
                  </strong>{" "}
                  {slot.slotNumber}
                </p>

                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {bookingData.date}
                </p>

                <p>
                  <strong>
                    Start Time:
                  </strong>{" "}
                  {bookingData.hour}:
                  {bookingData.minute}{" "}
                  {bookingData.period}
                </p>

                <p>
                  <strong>
                    Duration:
                  </strong>{" "}
                  {bookingData.durationHours}
                  {" "}hour(s)
                </p>

                <p>
                  <strong>
                    End Time:
                  </strong>{" "}
                  {getEndTime()}
                </p>

                <p>
                  <strong>
                    Availability:
                  </strong>{" "}

                  {isPastTime()
                    ? "🔴 Time has already passed"
                    : isTimeAvailable()
                      ? "🟢 Available"
                      : "🔴 Already Booked"}

                </p>

              </div>

            )}

            <button
              type="submit"
              className="confirm-button"
              disabled={
                bookingData.date &&
                !isTimeAvailable()
              }
            >
              {isPastTime()
                ? "❌ Time Already Passed"
                : !isTimeAvailable()
                  ? "❌ Time Not Available"
                  : "✅ Confirm Booking"}
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}

export default BookingPage;