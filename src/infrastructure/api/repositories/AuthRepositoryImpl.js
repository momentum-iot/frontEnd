import { AuthRepository } from "../../../domain/repositories/AuthRepository";
import httpClient from '../config/httpClient.js';
import { API_ENDPOINTS } from '../config/apiConfig.js';
import { TokenStorage } from '../../storage/TokenStorage.js'; 
import { User } from '../../../domain/entities/User.js';

export class AuthRepositoryImpl extends AuthRepository {

    async register(userData) {
        try {
            const response = await httpClient.post(
                API_ENDPOINTS.AUTH.REGISTER,
                userData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await httpClient.post(
                API_ENDPOINTS.AUTH.LOGIN,
                { email, password }
            );

            const token = response.data.token || response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const user = response.data.user;

            if (token) TokenStorage.setAccessToken(token);
            if (refreshToken) TokenStorage.setRefreshToken(refreshToken);
            if (user) TokenStorage.setUserData(user);

            return response.data;
        } catch (error) {
            console.error("[AuthRepositoryImpl] Login error:", error);
            throw error;
        }
    }

    async logout(refreshToken) {
        try {
            const response = await httpClient.post(
                API_ENDPOINTS.AUTH.LOGOUT,
                { refreshToken }
            );

            TokenStorage.clear();
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async refresh(refreshToken) {
        try {
            const response = await httpClient.post(
                API_ENDPOINTS.AUTH.REFRESH,
                { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            if (accessToken) TokenStorage.setAccessToken(accessToken);
            if (newRefreshToken) TokenStorage.setRefreshToken(newRefreshToken);

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const response = await httpClient.get(API_ENDPOINTS.AUTH.GET_PROFILE);
            return User.fromBackend(response.data);
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const response = await httpClient.get(API_ENDPOINTS.AUTH.GET_ALL);
            return User.fromBackendArray(response.data);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const response = await httpClient.get(API_ENDPOINTS.AUTH.BY_ID(id));
            return User.fromBackend(response.data);
        } catch (error) {
            throw error;
        }
    }
}

export const authRepository = new AuthRepositoryImpl();
