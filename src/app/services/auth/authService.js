import apiClient from "../api/apiClient";
import { API_ENDPOINTS } from "../api/apiEndpoints";

export const login = async (credentials) => {
  const response = await apiClient.post(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  return response;
};

export const logout = async () => {
  const response = await apiClient.post(
    API_ENDPOINTS.AUTH.LOGOUT
  );

  return response.data;
};