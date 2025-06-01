import { API_ENDPOINTS, getAuthHeaders } from "../config/api";

class ApiService {
  static async request(endpoint, options = {}) {
    try {
      console.log("Making request to:", endpoint);
      console.log("Request options:", options);

      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw {
          response: {
            data: data,
            status: response.status,
          },
          message: data.message || "Something went wrong",
        };
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw error;
      }
      throw new Error(error.message || "Network error");
    }
  }

  // Auth methods
  static async login(email, password) {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData) {
    return this.request(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  }

  static async logout() {
    return this.request(API_ENDPOINTS.LOGOUT, {
      method: "POST",
    });
  }

  // Campaign methods
  static async getCampaigns() {
    return this.request(API_ENDPOINTS.CAMPAIGNS);
  }

  static async getCampaignDetails(id) {
    return this.request(API_ENDPOINTS.CAMPAIGN_DETAILS(id));
  }

  static async createCampaign(campaignData) {
    return this.request(API_ENDPOINTS.CREATE_CAMPAIGN, {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
  }

  static async updateCampaign(id, campaignData) {
    return this.request(API_ENDPOINTS.UPDATE_CAMPAIGN(id), {
      method: "PUT",
      body: JSON.stringify(campaignData),
    });
  }

  static async deleteCampaign(id) {
    return this.request(API_ENDPOINTS.DELETE_CAMPAIGN(id), {
      method: "DELETE",
    });
  }

  // User methods
  static async getUserProfile() {
    return this.request(API_ENDPOINTS.USER_PROFILE);
  }

  static async updateUserProfile(userData) {
    return this.request(API_ENDPOINTS.UPDATE_PROFILE, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Admin methods
  static async getAdminUsers() {
    return this.request(API_ENDPOINTS.ADMIN_USERS);
  }

  static async getAdminCampaigns() {
    return this.request(API_ENDPOINTS.ADMIN_CAMPAIGNS);
  }

  static async getAdminReports() {
    return this.request(API_ENDPOINTS.ADMIN_REPORTS);
  }

  static async getAdminWithdrawals() {
    return this.request(API_ENDPOINTS.ADMIN_WITHDRAWALS);
  }
}

export default ApiService;
