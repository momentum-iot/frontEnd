export const API_BASE_URL = "http://localhost:8080/api"

export const API_ENDPOINTS = {
    /*AUTH: {
      BASE: '/api/auth',
      REGISTER: '/api/auth/register',      
      LOGIN: '/api/auth/login',   
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',               
      ALL: '/api/auth',                   
      BY_ID: (id) => `/api/auth/${id}`    
    },
    
    
    CHECK: {
      BASE: '/api/check',
      IN: '/api/check/in',           
      OUT: '/api/check/out',          
      CONCURRENCY: '/api/check/concurrency',
      STATUS: '/api/check/status'          
    }*/

    AUTH: {
        LOGIN: "auth/login",
        REGISTER: "auth/register",
        REFRESH: "auth/refresh",
        LOGOUT: "auth/logout",
        GET_PROFILE: "auth/me"
    },


    CHECK: {
        CHECK_IN: "check/in",
        CHECK_OUT: "check/out",
        GET_CONCURRENCY: "check/concurrency",
        GET_USER_STATUS: "check/status",
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