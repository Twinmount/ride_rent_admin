export enum Slug {
  // Authentication Endpoints
  LOGIN = '/auth/admin/login',
  REGISTER = '/auth/send-otp',
  VERIFY_OTP = '/auth/verify-otp',
  REFRESH = '/auth/refresh',

  // States Endpoints
  ADD_STATE = '/states',
  GET_STATE = '/states',
  PUT_STATE = '/states',
  DELETE_STATE = '/states',
  GET_ALL_STATES = '/states/list',

  // Cities Endpoints
  ADD_CITY = '/city',
  GET_CITY = '/city',
  PUT_CITY = '/city',
  DELETE_CITY = '/city',
  GET_ALL_CITIES = '/city/list',

  // Vehicle Categories Endpoints
  ADD_CATEGORY = '/vehicle-category',
  GET_CATEGORY = '/vehicle-category',
  PUT_CATEGORY = '/vehicle-category',
  DELETE_CATEGORY = '/vehicle-category',
  GET_ALL_CATEGORIES = '/vehicle-category/list',

  // Vehicle Types Endpoints
  ADD_VEHICLE_TYPE = '/vehicle-type',
  GET_VEHICLE_TYPE = '/vehicle-type',
  PUT_VEHICLE_TYPE = '/vehicle-type',
  GET_ALL_VEHICLE_TYPE = '/vehicle-type/list',

  // Brands Endpoints
  ADD_BRAND = '/vehicle-brand',
  GET_BRAND = '/vehicle-brand',
  PUT_BRAND = '/vehicle-brand',
  DELETE_BRAND = '/vehicle-brand',
  GET_ALL_BRANDS = '/vehicle-brand/list',

  // Links Endpoints
  ADD_LINK = '/links',
  GET_LINK = '/links',
  PUT_LINK = '/links',
  DELETE_LINK = '/links',
  GET_ALL_LINKS = '/links/list',

  // Links Endpoints
  ADD_PROMOTION = '/promotions',
  GET_PROMOTION = '/promotions',
  PUT_PROMOTION = '/promotions',
  DELETE_PROMOTION = '/promotions',
  GET_ALL_PROMOTIONS = '/promotions/list',

  // agent end points
  POST_COMPANY = '/company',
  PUT_COMPANY = '/company/admin',
  PUT_COMPANY_STATUS = '/company/approve-or-reject',
  GET_COMPANY = '/company',
  DELETE_COMPANY = '/company',
  GET_ALL_COMPANY = '/company/list',

  // vehicles end points
  POST_VEHICLE = '/vehicle',
  PUT_VEHICLE = '/vehicle/admin',
  PUT_VEHICLE_STATUS = '/vehicle/approve-or-reject',
  GET_VEHICLE = '/vehicle',
  DELETE_VEHICLE = '/vehicle',
  GET_ALL_VEHICLES = '/vehicle/listed/all',
  GET_NEW_OR_MODIFIED_VEHICLES = '/vehicle/all/modified',
  PUT_TOGGLE_VEHICLE_VISIBILITY = '/vehicle/toggle-visibility',
  GET_LEVELS_FILLED = '/vehicle/level-filled',

  // vehicle primary form endPoints
  POST_PRIMARY_FORM = '/vehicle/level-one',
  PUT_PRIMARY_FORM = '/vehicle/level-one',
  GET_PRIMARY_FORM = '/vehicle/level-one',

  // vehicle specification form endPoints
  GET_SPEC_FORM_FIELD_LIST = '/vehicle-spec/list',
  GET_SPEC_FORM_DATA = '/vehicle/level-two',
  POST_SPECIFICATION_FORM = '/vehicle/level-two',
  PUT_SPECIFICATION_FORM = '/vehicle/level-two',

  // vehicle features form endPoints
  GET_FEATURES_FORM_FIELD_LIST = '/vehicle-features/list',
  POST_FEATURES_FORM = '/vehicle/level-three',
  GET_FEATURES_FORM_DATA = '/vehicle/level-three',
  PUT_FEATURES_FORM_DATA = '/vehicle/level-three',
}
