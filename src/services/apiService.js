import axios from 'axios';

let authToken = null;

const apiService = axios.create({
  baseURL: `https://tabghalmaca.com/api/v1`,
});

apiService.interceptors.request.use((config) => {
  if (authToken) {
    config.headers['x_header_access_token'] = authToken;
  }
  return config;
});

apiService.interceptors.response.use((res) => res.data);

apiService.setAuthToken = (token) => {
  authToken = token;
};

apiService.removeAuthToken = () => {
  authToken = null;
};

export default apiService;
