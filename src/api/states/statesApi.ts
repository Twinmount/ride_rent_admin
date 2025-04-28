import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchCountryResponse,
  FetchSpecificStateResponse,
  FetchStatesResponse,
  GetStateFAQResponse,
} from "@/types/api-types/API-types";

export interface StateType {
  stateName: string;
  stateValue: string;
  stateImage: string;
  parentStateId?: string | null;
  countryId?: string | null;
  isParentState?: boolean | null;
}

// add state
export const addState = async (
  values: StateType,
  selectedStates: string[],
  countryId?: string | null,
) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_STATE,
      body: {
        stateName: values.stateName,
        stateValue: values.stateValue,
        stateImage: values.stateImage,
        parentStateId: values.parentStateId,
        countryId: countryId,
        relatedStates: selectedStates,
        isParentState: values.isParentState,
      },
    });

    return data;
  } catch (error) {
    console.error("Error adding state:", error);
    throw error;
  }
};

// update state
export const updateState = async (
  values: StateType,
  stateId: string,
  selectedStates: string[],
) => {
  try {
    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_STATE, // Use the correct slug
      body: {
        stateId: stateId,
        stateName: values.stateName,
        stateValue: values.stateValue,
        stateImage: values.stateImage, // String URL of the uploaded image
        relatedStates: selectedStates,
      },
    });

    return data;
  } catch (error) {
    console.error("Error updating state:", error);
    throw error;
  }
};

// fetch specific state by ID
export const fetchStateById = async (
  stateId: string,
): Promise<FetchSpecificStateResponse> => {
  try {
    const data = await API.get<FetchSpecificStateResponse>({
      slug: `${Slug.GET_STATE}?stateId=${stateId}`, // Interpolating the stateId into the slug
    });

    if (!data) {
      throw new Error("Failed to fetch state data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching State:", error);
    throw error;
  }
};

// fetch all States
export const fetchAllStates = async (
  countryId?: string | null,
  parentStateId?: string | null,
  count?: number | null,
  searchTerm?: string | null,
  stateId?: string | null,
): Promise<FetchStatesResponse> => {
  try {
    let params = new URLSearchParams();

    if (countryId) {
      params.append("countryId", countryId);
    }
    if (parentStateId) {
      params.append("parentStateId", parentStateId);
    }
    if (stateId) {
      params.append("stateId", stateId);
    }
    if (count) {
      params.append("count", JSON.stringify(count));
    }
    if (searchTerm) {
      params.append("searchTerm", searchTerm);
    }

    const slug = params.toString()
      ? `${Slug.GET_ALL_STATES}?${params.toString()}`
      : `${Slug.GET_ALL_STATES}`;

    const data = await API.get<FetchStatesResponse>({
      slug: slug,
    });

    if (!data) {
      throw new Error("Failed to fetch state data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching States:", error);
    throw error;
  }
};

export const fetchAllParentStatesByCountryId = async (
  countryId: string,
): Promise<FetchStatesResponse> => {
  try {
    let slug = `${Slug.GET_ALL_PARENT_STATES}`;

    if (!!countryId) {
      slug = slug + `?countryId=${countryId}`;
    }

    const data = await API.get<FetchStatesResponse>({
      slug: slug,
    });

    if (!data) {
      throw new Error("Failed to fetch state data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching States:", error);
    throw error;
  }
};

export const fetchAllCountry = async (): Promise<FetchCountryResponse> => {
  try {
    const data = await API.get<FetchCountryResponse>({
      slug: Slug.GET_ALL_COUNTRY,
    });

    if (!data) {
      throw new Error("Failed to fetch country data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Country:", error);
    throw error;
  }
};

// delete specific state by ID
export const deleteState = async (stateId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_STATE}?stateId=${stateId}`,
    });
    return data;
  } catch (error) {
    console.error("Error deleting States:", error);
    throw error;
  }
};

export const getStateFaqFn = async (
  stateId: string,
): Promise<GetStateFAQResponse> => {
  try {
    const url = `${Slug.GET_STATE_FAQ}/${stateId}`;

    const data = await API.get<GetStateFAQResponse>({
      slug: url,
    });

    if (!data) {
      throw new Error("Failed to fetch levels filled");
    }

    return data;
  } catch (error) {
    console.error("Error fetching levels filled data:", error);
    throw error;
  }
};
type StateFAQItem = {
  question: string;
  answer: string;
};

type UpdateStateFAQPayload = {
  stateId: string;
  faqs: StateFAQItem[];
};

export const upadteStateFaqFn = async (requestBody: UpdateStateFAQPayload) => {
  try {
    const data = await API.post({
      slug: Slug.PUT_STATE_FAQ,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error updating specification form data:", error);
    throw error;
  }
};
