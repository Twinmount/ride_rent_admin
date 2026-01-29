export enum FaqType {
  SERIES = "series",
  VEHICLE_BUCKET = "vehicle-bucket",
}

export interface ContentFaq {
  _id: string;
  faqType: FaqType;
  question: string;
  answer: string;
  targetId: string;
}

export interface CreateContentFaqRequest {
  faqType: FaqType;
  question: string;
  answer: string;
  targetId: string;
}

export interface UpdateContentFaqRequest {
  faqType: FaqType;
  question: string;
  answer: string;
  targetId: string;
}

export interface FetchFaqsResponse {
  success: boolean;
  data: ContentFaq[];
}

export interface ContentFaqResponse {
  success: boolean;
  data: ContentFaq;
}
