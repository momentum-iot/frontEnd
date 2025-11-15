export const API_BASE_URL = "http://localhost:8080";

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

  TIMEOUT: 30000,


  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },


  TOKEN_EXPIRY: 3600000,


  REFRESH_TOKEN_EXPIRY: 604800000
};