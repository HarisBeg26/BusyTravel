/**
 * Application configuration
 */
const config = {
  // API base URL that changes based on environment
  apiBaseUrl: import.meta.env.PROD
    ? 'https://business-travel-backend.onrender.com/api' // Replace with your actual Render backend URL
    : 'http://localhost:3000/api'
};

export default config;
