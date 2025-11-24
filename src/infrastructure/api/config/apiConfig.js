// Usa variables de entorno inyectadas por Vite/Netlify, con fallback local.
const ENV_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = (ENV_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT);
const DEFAULT_TIMEOUT = 30000;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    GET_PROFILE: "/api/auth/me",
    GET_ALL: "/api/users"
  },
  CHECK: {
    CHECK_IN: "/api/check/in",
    CHECK_OUT: "/api/check/out",
    GET_CONCURRENCY: "/api/check/concurrency",
    GET_USER_STATUS: "/api/check/status",
  }
};


export const API_CONFIG = {

  TIMEOUT: Number.isFinite(parsedTimeout) ? parsedTimeout : DEFAULT_TIMEOUT,


  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },


  TOKEN_EXPIRY: 3600000,


  REFRESH_TOKEN_EXPIRY: 604800000
};
