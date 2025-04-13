import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchSpecificStateResponse,
  FetchStatesResponse,
  GetStateFAQResponse,
} from "@/types/api-types/API-types";

export interface StateType {
  stateName: string;
  stateValue: string;
  stateImage: string;
}

// add state
export const addState = async (values: StateType, selectedStates: string[]) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_STATE,
      body: {
        stateName: values.stateName,
        stateValue: values.stateValue,
        stateImage: values.stateImage,
        relatedStates: selectedStates,
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
export const fetchAllStates = async (): Promise<FetchStatesResponse> => {
  try {
    const data = await API.get<FetchStatesResponse>({
      slug: Slug.GET_ALL_STATES,
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
