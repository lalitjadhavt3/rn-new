import axios from 'axios';
const ENV = 'PROD';
export const API_BASE_URL =
  ENV == 'PROD'
    ? 'https://srgeniusacademy.com/dashboard/'
    : 'http://192.168.1.6/nexus/'; // Replace with your API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
});
export default api;
