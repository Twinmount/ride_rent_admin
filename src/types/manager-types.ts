/** Represents a single Manager entity associated with an Agent. */
export interface Manager {
  id: string;
  agentId: string;
  name: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  email?: string;
  profilePicture?: string;
  createdAt?: string;
  languages?: string[];
  workingHours?: any[];
}

/** Shape of data used to create or update a Manager. */
export interface ManagerFormData {
  name: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  email?: string;
  profilePicture?: string;
  languages?: string[];
  workingHours?: any[];
}

/** Standard API response wrapper for manager endpoints. */
export interface ManagerApiResponse {
  result: Manager;
  message?: string;
}

export interface ManagersListApiResponse {
  result: Manager[];
}

export const MAX_MANAGERS = 10;
