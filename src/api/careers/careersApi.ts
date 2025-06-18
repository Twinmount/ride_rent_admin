import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";

export interface FetchApplicationResponse {
  result: [];
  status: string;
  statusCode: number;
}

export const fetchApplications = async (
  type: string,
): Promise<FetchApplicationResponse> => {
  try {
    const data = await API.get<FetchApplicationResponse>({
      slug: `${Slug.GET_APPLICATIONS}?status=${type}`,
    });

    if (!data) {
      throw new Error("Failed to fetch Applications List");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Application List:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (payload: {
  id: string;
  status: string;
}): Promise<FetchApplicationResponse> => {
  try {
    const { id, status } = payload;

    const data = await API.patch<FetchApplicationResponse>({
      slug: `${Slug.UPDATE_APPLICATION_STATUS}/${id}/status`,
      body: { status },
    });

    if (!data) {
      throw new Error("Failed to fetch Applications List");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Application List:", error);
    throw error;
  }
};

export const fetchJobs = async (): Promise<FetchApplicationResponse> => {
  try {
    const data = await API.get<FetchApplicationResponse>({
      slug: Slug.GET_ALL_JOBS,
    });

    if (!data) {
      throw new Error("Failed to fetch Jobs List");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Jobs List:", error);
    throw error;
  }
};

export const fetchJobById = async (
  jobId: string,
): Promise<FetchApplicationResponse> => {
  try {
    const data = await API.get<FetchApplicationResponse>({
      slug: `${Slug.GET_JOB}/${jobId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch Job");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Job:", error);
    throw error;
  }
};
