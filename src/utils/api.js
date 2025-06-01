// src/utils/api.js
import { API_ENDPOINTS, getAuthHeaders } from "../config/api";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = {
  get: async (endpoint) => {
    console.log(`Making GET request to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { status: response.status, data } };
    }
    return data;
  },

  post: async (endpoint, body, customHeaders = {}) => {
    console.log(`Making POST request to: ${API_BASE_URL}${endpoint}`);
    if (body instanceof FormData) {
      console.log("POST payload (FormData):");
      for (let [key, value] of body.entries()) {
        console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
      }
    } else {
      console.log("POST payload:", body);
    }
    const isFormData = body instanceof FormData;
    const headers = {
      ...getAuthHeaders(endpoint === API_ENDPOINTS.LOGIN),
      ...customHeaders,
    };
    // Explicitly avoid Content-Type for FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    } else {
      // Remove Content-Type to let browser set multipart/form-data
      delete headers["Content-Type"];
    }
    console.log("Request headers:", JSON.stringify(headers, null, 2));
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    // Log Content-Type from request (if available)
    const sentContentType = response.headers.get('content-type') || 'Not captured';
    console.log("Sent Content-Type:", sentContentType);
    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);
    if (!response.ok) {
      throw { response: { status: response.status, data } };
    }
    return data;
  },
};

export { api, API_BASE_URL };