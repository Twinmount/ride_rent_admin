export enum FaqType {
  SERIES = "series",
  VEHICLE_BUCKET = "vehicle-bucket",
  CITY = "city",
  BRAND = "brand",
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
  result: {
    success: boolean;
    data: ContentFaq[];
  };
  status?: string;
  statusCode?: number;
}

export interface ContentFaqResponse {
  success: boolean;
  data: ContentFaq;
}
