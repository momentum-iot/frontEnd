import httpClient from "../config/httpClient.js";

export const createMembershipCheckoutSession = async (membershipType) => {
  try {
    const response = await httpClient.post("/api/payments/membership", {
      membership: membershipType,
    });
    // Backend ideal: { url } (preferido) o { sessionId }
    return response.data;
  } catch (error) {
    // Deja pasar el error con el detalle del backend
    throw error;
  }
};
