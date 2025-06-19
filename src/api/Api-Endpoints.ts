export enum Slug {
  // Authentication Endpoints
  LOGIN = "/auth/admin/login",
  REGISTER = "/auth/send-otp",
  VERIFY_OTP = "/auth/verify-otp",
  REFRESH = "/auth/refresh",

  // file upload endpoints
  POST_SINGLE_FILE = "/file/upload/single",
  GET_SINGLE_FILE = "/file",
  DELETE_SINGLE_FILE = "/file",
  POST_MULTIPLE_FILES = "/file/upload/multiple",

  // States Endpoints
  ADD_STATE = "/states",
  GET_STATE = "/states",
  PUT_STATE = "/states",
  DELETE_STATE = "/states",
  GET_ALL_STATES = "/states/list",
  GET_ALL_PARENT_STATES = "/states/parent/list",
  GET_COUNTRY = "/country",
  GET_ALL_COUNTRY = "/country/list",
  ADD_HOME_PAGE_BANNER = "/homepage-banners",

  // Cities Endpoints
  ADD_CITY = "/city",
  GET_CITY = "/city",
  PUT_CITY = "/city",
  DELETE_CITY = "/city",
  GET_ALL_CITIES = "/city/list",

  // Vehicle Categories Endpoints
  ADD_CATEGORY = "/vehicle-category",
  GET_CATEGORY = "/vehicle-category",
  PUT_CATEGORY = "/vehicle-category",
  DELETE_CATEGORY = "/vehicle-category",
  GET_ALL_CATEGORIES = "/vehicle-category/list",

  // Vehicle Types Endpoints
  ADD_VEHICLE_TYPE = "/vehicle-type",
  GET_VEHICLE_TYPE = "/vehicle-type",
  PUT_VEHICLE_TYPE = "/vehicle-type",
  GET_ALL_VEHICLE_TYPE = "/vehicle-type/list",

  // Brands Endpoints
  ADD_BRAND = "/vehicle-brand",
  GET_BRAND = "/vehicle-brand",
  PUT_BRAND = "/vehicle-brand",
  DELETE_BRAND = "/vehicle-brand",
  GET_ALL_BRANDS = "/vehicle-brand/list",

  // Links Endpoints
  ADD_LINK = "/links",
  GET_LINK = "/links",
  PUT_LINK = "/links",
  DELETE_LINK = "/links",
  GET_ALL_LINKS = "/links/list",

  // Related Links Endpoints
  ADD_RELATED_LINK = "/recomented-links",
  GET_RELATED_LINK = "/recomented-links",
  PUT_RELATED_LINK = "/recomented-links",
  DELETE_RELATED_LINK = "/recomented-links",
  GET_ALL_RELATED_LINKS = "/recomented-links/list",

  // Links Endpoints
  ADD_PROMOTION = "/promotions",
  GET_PROMOTION = "/promotions",
  PUT_PROMOTION = "/promotions",
  DELETE_PROMOTION = "/promotions",
  GET_ALL_PROMOTIONS = "/promotions/list",

  // company end points
  POST_COMPANY = "/company",
  PUT_COMPANY = "/company/admin",
  PUT_COMPANY_STATUS = "/company/approve-or-reject",
  GET_COMPANY = "/company",
  DELETE_COMPANY = "/company",
  GET_ALL_COMPANY = "/company/list",
  GET_COMPANY_LISTINGS_COUNT = "/company/dashboard/count",
  GET_PROMOTED_COMPANIES_LIST = "/company-promotion/list",
  GET_PROMOTED_COMPANIES_SEARCH = "/company/search",
  POST_PROMOTED_COMPANY = "/company-promotion",
  DELETE_PROMOTED_COMPANY = "/company-promotion",

  // vehicles end points
  POST_VEHICLE = "/vehicle",
  PUT_VEHICLE = "/vehicle/admin",
  PUT_VEHICLE_STATUS = "/vehicle/approve-or-reject",
  GET_VEHICLE = "/vehicle",
  DELETE_VEHICLE = "/vehicle",
  GET_ALL_VEHICLES = "/vehicle/listed/all",
  GET_NEW_OR_MODIFIED_VEHICLES = "/vehicle/all/modified",
  PUT_TOGGLE_VEHICLE_VISIBILITY = "/vehicle/toggle-visibility",
  GET_LEVELS_FILLED = "/vehicle/level-filled",
  GET_VEHICLE_LISTINGS_COUNT_BY_STATE = "/vehicle/dashboard/count",
  GET_ALL_VEHICLE_LISTINGS_COUNT = "/vehicle/dashboard/count/state",

  // vehicle series end points
  POST_VEHICLE_SERIES = "/vehicle-series",
  GET_SEARCH_VEHICLE_SERIES = "/vehicle-series/search",
  PUT_VEHICLE_SERIES = "/vehicle-series",
  GET_SERIES_BY_ID = "/vehicle-series",
  GET_ALL_SERIES = "/vehicle-series/list",

  // vehicle primary form endPoints
  POST_PRIMARY_FORM = "/vehicle/level-one",
  PUT_PRIMARY_FORM = "/vehicle/level-one",
  GET_PRIMARY_FORM = "/vehicle/level-one",
  GET_PRIMARY_FORM_DEFAULT = "/vehicle/level-one-default",

  // vehicle specification form endPoints
  GET_SPEC_FORM_FIELD_LIST = "/vehicle-spec/list",
  GET_SPEC_FORM_DATA = "/vehicle/level-two",
  POST_SPECIFICATION_FORM = "/vehicle/level-two",
  PUT_SPECIFICATION_FORM = "/vehicle/level-two",

  // vehicle features form endPoints
  GET_FEATURES_FORM_FIELD_LIST = "/vehicle-features/list",
  POST_FEATURES_FORM = "/vehicle/level-three",
  GET_FEATURES_FORM_DATA = "/vehicle/level-three",
  PUT_FEATURES_FORM_DATA = "/vehicle/level-three",

  // vehicle faq form endPoints
  GET_FAQ_TEMPLATE = "/vehicle-faq",
  PUT_FAQ_TEMPLATE = "/vehicle-faq",
  GET_STATE_FAQ = "/state-faq",
  PUT_STATE_FAQ = "/state-faq",

  // meta data endpoints
  POST_ADMIN_HOME_META = "/metadata/homepage",
  GET_ADMIN_HOME_META = "/metadata/admin/homepage",
  PUT_ADMIN_HOME_META = "/metadata/homepage",
  GET_ADMIN_HOME_META_ALL = "/metadata/admin/homepage/all",

  POST_ADMIN_LISTING_META = "/metadata/listing",
  GET_ADMIN_LISTING_META = "/metadata/admin/listing",
  PUT_ADMIN_LISTING_META = "/metadata/listing",
  GET_ADMIN_LISTING_META_ALL = "/metadata/admin/listing/all",

  // similar to listing meta, we need "company metadata endpoints "
  POST_COMPANY_META = "/metadata/company",
  GET_ADMIN_COMPANY_META = "/metadata/admin/company",
  PUT_COMPANY_META = "/metadata/company",
  GET_COMPANY_META_ALL = "/metadata/admin/company/all",

  GET_ADMIN_DASHBOARD = "/vehicle/admin/analytics",

  // excel data download endpoints
  GET_DOWNLOAD_VEHICLE_DATA = "/vehicle/download/excel",
  GET_DOWNLOAD_COMPANY_DATA = "/company/download/excel",

  // Blogs Endpoints
  ADD_BLOG = "/blogs",
  GET_BLOG = "/blogs",
  PUT_BLOG = "/blogs",
  DELETE_BLOG = "/blogs",
  GET_ALL_BLOGS = "/blogs/list",

  // Advisor Blogs Endpoints
  ADD_ADVISOR_BLOG = "/advisor-blogs",
  GET_ADVISOR_BLOG = "/advisor-blogs",
  PUT_ADVISOR_BLOG = "/advisor-blogs",
  DELETE_ADVISOR_BLOG = "/advisor-blogs",
  GET_ALL_ADVISOR_BLOGS = "/advisor-blogs/list",

  // Blog Promotions Endpoints
  ADD_BLOG_PROMOTION = "/blogs-promotions",
  GET_BLOG_PROMOTION = "/blogs-promotions",
  PUT_BLOG_PROMOTION = "/blogs-promotions",
  DELETE_BLOG_PROMOTION = "/blogs-promotions",
  GET_ALL_BLOG_PROMOTIONS = "/blogs-promotions/list",

  // Advisor Blog Promotions Endpoints
  ADD_ADVISOR_BLOG_PROMOTION = "/advisor-blogs-promotions",
  GET_ADVISOR_BLOG_PROMOTION = "/advisor-blogs-promotions",
  PUT_ADVISOR_BLOG_PROMOTION = "/advisor-blogs-promotions",
  DELETE_ADVISOR_BLOG_PROMOTION = "/advisor-blogs-promotions",
  GET_ALL_ADVISOR_BLOG_PROMOTIONS = "/advisor-blogs-promotions/list",

  // Job Endpoints
  ADD_JOB = "/jobs",
  GET_JOB = "/jobs",
  PUT_JOB = "/jobs",
  DELETE_JOB = "/jobs",
  GET_ALL_JOBS = "/jobs/minimal-list",

  // Application Endpoints
  GET_APPLICATIONS = "/applications",
  UPDATE_APPLICATION_STATUS = "/applications",
  DELETE_APPLICATION = "/applications",
}
