import axios from 'axios';

import { API_BASE_URL, API_CONFIG } from './apiConfig.js';
import { TokenStorage } from '../../storage/TokenStorage.js';


const httpClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

httpClient.interceptors.request.use(
    (config) => {

        const token = TokenStorage.getAccessToken();


        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }


        if (import.meta.env.DEV) {
            console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {

        console.error('[HTTP] Request error:', error);
        return Promise.reject(error);
    }

);

httpClient.interceptors.response.use(
    (response) => {

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Evitar intentos de refresh en endpoints de auth (login/register/refresh)
        const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/');


        if (!error.response) {
            console.error('[HTTP] Network error:', error.message);
            return Promise.reject({
                message: 'Error de conexión. Verifica tu internet.',
                type: 'NETWORK_ERROR'
            });
        }

        const { status, data } = error.response;


        if (import.meta.env.DEV) {
            console.error(`[HTTP] ${status} ${originalRequest.url}`, data);
        }


        if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return httpClient(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }


            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = TokenStorage.getRefreshToken();


            if (!refreshToken) {
                TokenStorage.clear();
                processQueue(new Error('No refresh token available'), null);
                isRefreshing = false;


                window.dispatchEvent(new CustomEvent('auth:logout'));

                return Promise.reject({
                    message: 'Sesión expirada. Inicia sesión nuevamente.',
                    type: 'SESSION_EXPIRED'
                });
            }

            try {

                const response = await axios.post(
                    `${API_BASE_URL}/api/auth/refresh`,
                    { refreshToken },
                    { headers: API_CONFIG.DEFAULT_HEADERS }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;


                TokenStorage.setAccessToken(accessToken);
                TokenStorage.setRefreshToken(newRefreshToken);


                originalRequest.headers.Authorization = `Bearer ${accessToken}`;


                processQueue(null, accessToken);
                isRefreshing = false;


                return httpClient(originalRequest);
            } catch (refreshError) {

                processQueue(refreshError, null);
                isRefreshing = false;
                TokenStorage.clear();


                window.dispatchEvent(new CustomEvent('auth:logout'));

                return Promise.reject({
                    message: 'Sesión expirada. Inicia sesión nuevamente.',
                    type: 'SESSION_EXPIRED'
                });
            }
        }

        // Propagar otros errores con el mensaje del backend si existe
        const backendMessage = data?.message || data?.error;
        return Promise.reject({
            message: backendMessage || error.message || 'Error en la petición',
            status
        });

    }
);

export default httpClient;


