import { AuthRepository } from "../../../domain/repositories/AuthRepository";
import httpClient from '../config/httpClient.js';
import { API_ENDPOINTS } from '../config/apiConfig.js';
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

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async logout(refreshToken) {
        try {
            const response = await httpClient.post(
                API_ENDPOINTS.AUTH.LOGOUT,
                { refreshToken }
            );

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
            const response = await httpClient.get(API_ENDPOINTS.AUTH.ALL);

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