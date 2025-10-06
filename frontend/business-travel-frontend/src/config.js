/**
 * Application configuration
 */
const config = {
  // API base URL that changes based on environment
  apiBaseUrl: import.meta.env.PROD
    ? 'https://busytravel.onrender.com' // Removed the trailing slash
    : 'http://localhost:3000/api'
};

export default config;
