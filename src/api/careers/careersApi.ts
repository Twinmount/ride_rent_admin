import { JobFormType } from "@/types/types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
interface FetchResponse {
  status: string;
  statusCode: number;
}

interface Response {
  list: JobFormType[];
  page: number;
  limit: number;
  total: number;
  totalNumberOfPages: number;
}

export interface FetchApplicationResponse extends FetchResponse {
  result: Response;
}

export interface FetchSingleResponse extends FetchResponse {
  result: JobFormType;
}

export const fetchApplications = async ({
  status,
  page,
  limit,
}: {
  status: string;
  page: number;
  limit: number;
}): Promise<FetchApplicationResponse> => {
  try {
    const data = await API.get<FetchApplicationResponse>({
      slug: `${Slug.GET_APPLICATIONS}?status=${status}&page=${page}&limit=${limit}`,
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
}): Promise<FetchSingleResponse> => {
  try {
    const { id, status } = payload;

    const data = await API.patch<FetchSingleResponse>({
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

export const removeApplicationById = async (id: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_APPLICATION}/${id}`,
    });

    if (!data) {
      throw new Error("Failed to delete Applications");
    }

    return data;
  } catch (error) {
    console.error("Error delete Application:", error);
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
): Promise<FetchSingleResponse> => {
  try {
    const data = await API.get<FetchSingleResponse>({
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

// add job
export const addJob = async (values: JobFormType) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_JOB,
      body: values,
    });

    return data;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

// update job
export const updateJob = async (values: JobFormType, jobId: string) => {
  try {
    const data = await API.patch({
      slug: `${Slug.PUT_JOB}/${jobId}`,
      body: values,
    });

    return data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJobById = async (jobId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_JOB}/${jobId}`,
    });

    return data;
  } catch (error) {
    console.error("Error deleting Job:", error);
    throw error;
  }
};
