import { API } from "@/api/ApiService";
import type {
  ManagerApiResponse,
  ManagerFormData,
  ManagersListApiResponse,
} from "@/types/manager-types";

const BASE_SLUG = "/company/managers";

/**
 * Fetches all managers associated with a specific agent.
 * Backend: GET /company/managers?agentId={agentId}
 */
export const fetchManagers = async (agentId: string): Promise<ManagersListApiResponse> => {
  const data = await API.get<ManagersListApiResponse>({
    slug: `${BASE_SLUG}?agentId=${agentId}`,
  });
  if (!data) throw new Error("Failed to fetch managers");
  return data;
};

/**
 * Creates a new manager for the given agent.
 * Backend: POST /company/managers  { agentId, name, gender, phoneNumber, email, profilePicture }
 */
export const createManager = async (
  agentId: string,
  formData: ManagerFormData
): Promise<ManagerApiResponse> => {
  const data = await API.post<ManagerApiResponse>({
    slug: BASE_SLUG,
    body: { agentId, ...formData },
  });
  if (!data) throw new Error("Failed to create manager");
  return data;
};

/**
 * Updates an existing manager record.
 * Backend: PUT /company/managers/{managerId}  { agentId, ...fields }
 */
export const updateManager = async (
  managerId: string,
  agentId: string,
  formData: ManagerFormData
): Promise<ManagerApiResponse> => {
  const data = await API.put<ManagerApiResponse>({
    slug: `${BASE_SLUG}/${managerId}`,
    body: { agentId, ...formData },
  });
  if (!data) throw new Error("Failed to update manager");
  return data;
};

/**
 * Soft-deletes a manager record.
 * Backend: DELETE /company/managers/{managerId}?agentId={agentId}
 */
export const deleteManager = async (managerId: string, agentId: string): Promise<void> => {
  await API.delete({ slug: `${BASE_SLUG}/${managerId}?agentId=${agentId}` });
};
