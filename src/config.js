// Centralized API Base URL configuration
// Automatically switches between local backend (during local dev)
// and production Render backend (when deployed on Vercel or any other domain)

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
   (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://smart-parking-backend-gtsr.onrender.com");

export default API_BASE_URL;
