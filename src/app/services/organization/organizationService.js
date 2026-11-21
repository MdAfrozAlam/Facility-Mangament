import apiClient from "../api/apiClient";
import { API_ENDPOINTS } from "../api/apiEndpoints";

export const getOrganizations = async () => {
  const tenantId = sessionStorage.getItem("tenantId");
  if (!tenantId) {
    throw new Error("Tenant ID is not available in session storage.");
  }

  const response = await apiClient.get(
    API_ENDPOINTS.ORGANIZATIONS.LIST.replace(":tenantId", tenantId)
  );

  return response.data;
};

export const createOrganization = async (payload) => {
  const tenantId = sessionStorage.getItem("tenantId");
  if (!tenantId) {
    throw new Error("Tenant ID is not available in session storage.");
  }

  payload.tenantId = tenantId;
  const response = await apiClient.post(
    API_ENDPOINTS.ORGANIZATIONS.CREATE,
    payload
  );

  return response.data;
};

export const updateOrganization = async (id, payload) => {
  const response = await apiClient.patch(
    `${API_ENDPOINTS.ORGANIZATIONS.UPDATE}/${id}`,
    payload
  );

  return response.data;
};

export const deleteOrganization = async (id) => {
  const response = await apiClient.delete(
    `${API_ENDPOINTS.ORGANIZATIONS.DELETE}/${id}`
  );

  return response.data;
};
