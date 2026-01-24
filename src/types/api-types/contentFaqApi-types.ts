export interface ContentFaq {
  _id: string;
  faqType: "series" | "city";
  question?: string;
  answer?: string;
  seriesId?: string;
  cityId?: string;
  state?: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentFaqRequest {
  faqType: "series" | "city";
  question?: string;
  answer?: string;
  seriesId?: string;
  cityId?: string;
  state?: "draft" | "published" | "archived";
}

export interface UpdateContentFaqRequest {
  faqType: "series" | "city";
  question?: string;
  answer?: string;
  seriesId?: string;
  cityId?: string;
  state?: "draft" | "published" | "archived";
}

export interface FetchSeriesFaqsResponse {
  success: boolean;
  data: ContentFaq[];
}

export interface FetchCityFaqsResponse {
  success: boolean;
  data: ContentFaq[];
}

export interface ContentFaqResponse {
  success: boolean;
  data: ContentFaq;
}

