import axios from 'axios';

// 判斷環境
const apiUrl = import.meta.env.VITE_API_BASE;
const server = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 5000,
});

export default server;
