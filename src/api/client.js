import axios from 'axios';
import { API_BASE_URL } from './config';

// Kept in memory. Persistent storage and refresh logic come in a later step.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // fail after 15s instead of hanging forever
  headers: { 'Content-Type': 'application/json' },
});

// Runs before every request: attach the token if we have one.
client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Runs on every response: turn any failure into one predictable error shape.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // The server answered with an error status (400, 401, 409, ...)
    if (error.response) {
      const { status, data } = error.response;
      const message = Array.isArray(data?.message)
        ? data.message.join('\n') // ValidationPipe returns an array of messages
        : data?.message || 'Something went wrong';
      return Promise.reject({ status, message });
    }

    // No response at all: server down, wrong URL, or no network
    return Promise.reject({
      status: null,
      message: 'Cannot reach the server. Check your connection.',
    });
  },
);

export default client;