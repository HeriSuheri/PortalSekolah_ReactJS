import { apiClient, handleError } from "../../service/BaseApi";

const API_ENDPOINTS = {
  ADMIN: process.env.REACT_APP_ADMIN,
  //   CREATE_ADMIN: process.env.REACT_APP_CREATE_ADMIN,
};

const DataService = {
  async getAdmin({ page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN, {
        params: { page, size },
      });

      console.log("RESPONSE API GET ADMIN:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Admin Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Admin Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Admin");
    }
  },

  async searchAdmin({ page = 0, size = 10, keyword = "" } = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ADMIN}/search`, {
        params: { page, size, keyword },
      });

      console.log("RESPONSE API SEARCH ADMIN:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Search Admin Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Search Admin Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search Admin");
    }
  },

  async createAdmin(payload) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN, payload);
      console.log("RESPONSE API CREATE ADMIN:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Create Admin Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Create Admin Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Create Admin");
    }
  },

  async updateAdmin(payload) {
    const { id, nama, email, tanggalLahir } = payload;
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ADMIN}/${id}`, {
        nama,
        email,
        tanggalLahir,
      });
      console.log("RESPONSE API UPDATE ADMIN:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Update Admin Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Update Admin Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Update Admin");
    }
  },

  async deleteAdm(payload) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.ADMIN}/${payload}`
      );
      console.log("RESPONSE API DELETE ADMIN:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Delete Admin Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Delete Admin Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Delete Admin");
    }
  },
};

export default DataService;
