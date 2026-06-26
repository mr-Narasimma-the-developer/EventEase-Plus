import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message
    });
    return Promise.reject(error);
  }
);

export default API;

// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Request interceptor - Add token to every request
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log('Token added to request:', config.url);
//     } else {
//       console.log('No token found for request:', config.url);
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle 401 errors
// API.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.response?.data?.message || error.message
//     });

//     // Handle 401 Unauthorized
//     if (error.response?.status === 401) {
//       console.log('401 Unauthorized - Clearing auth and redirecting to login');
      
//       // Clear auth data
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
      
//       // Redirect to login if not already there
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;