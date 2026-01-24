export interface ContentFaq {
  _id: string;
  faqType: "series";
  question?: string;
  answer?: string;
  seriesId?: string;
  state?: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentFaqRequest {
  faqType: "series";
  question?: string;
  answer?: string;
  seriesId?: string;
  state?: "draft" | "published" | "archived";
}

export interface UpdateContentFaqRequest {
  faqType: "series";
  question?: string;
  answer?: string;
  seriesId?: string;
  state?: "draft" | "published" | "archived";
}

export interface FetchSeriesFaqsResponse {
  success: boolean;
  data: ContentFaq[];
}

export interface ContentFaqResponse {
  success: boolean;
  data: ContentFaq;
}
