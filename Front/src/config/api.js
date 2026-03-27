const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://fashions-back.onrender.com/api';

export default API_URL;
