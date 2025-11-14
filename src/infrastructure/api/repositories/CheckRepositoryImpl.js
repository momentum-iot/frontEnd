import { CheckRepository } from "@/domain/repositories/CheckRepository";
import { API_ENDPOINTS } from '../config/apiConfig.js';
import httpClient from "../config/httpClient";
export class CheckRepositoryImpl extends CheckRepository {
  async checkIn() {
    try {
      const response = await httpClient.post(API_ENDPOINTS.CHECK.CHECK_IN);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkOut() {
    try {
      const response = await httpClient.post(API_ENDPOINTS.CHECK.CHECK_OUT);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConcurrency() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.CHECK.GET_CONCURRENCY);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async isUserInside() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.CHECK.GET_USER_STATUS);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

}

export const checkRepository = new CheckRepositoryImpl();