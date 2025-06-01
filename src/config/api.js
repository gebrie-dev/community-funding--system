// config/api.js
export const API_ENDPOINTS = {
  LOGIN: "/api/account/login/",
  REGISTER: "/api/account/register/",
  PROFILE: "/api/account/profile/",
  PASSWORD_RESET: "/api/account/password/reset/",
  CAMPAIGNS: "/api/campaigns/",
  CAMPAIGN_DETAIL: (id) => `/api/campaigns/${id}/`,
  CAMPAIGN_CREATE: "/api/campaigns/create/",
  ALL_CAMPAIGN: "/api/Allcampaigns/",
  changestatus: "/api/campaigns/review/",
  donate: "/api/donate/",
  withdraw: "/api/withdraw/",
};

export const getAuthHeaders = (isLogin = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token && !isLogin) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
