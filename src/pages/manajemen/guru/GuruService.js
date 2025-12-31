import { apiClient, handleError } from "../../../service/BaseApi";

const API_ENDPOINTS = {
  GURU: process.env.REACT_APP_GURU,
  //   CREATE_ADMIN: process.env.REACT_APP_CREATE_ADMIN,
};

const DataService = {
  async getGuru({ page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GURU, {
        params: { page, size },
      });

      console.log("RESPONSE API GET GURU:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Guru Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Guru Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Guru");
    }
  },

  async searchGuru({ page = 0, size = 10, keyword = "" } = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GURU}/search`, {
        params: { page, size, keyword },
      });

      console.log("RESPONSE API SEARCH GURU:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Search Guru Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Search Guru Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search Guru");
    }
  },

  async createGuru(payload) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GURU, payload);
      console.log("RESPONSE API CREATE GURU:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Create Guru Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Create Guru Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Create Guru");
    }
  },

  async updateGuru(payload) {
    const { id, nip, nama, tanggalLahir, email } = payload;
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.GURU}/${id}`, {
        nip,
        nama,
        email,
        tanggalLahir,
      });
      console.log("RESPONSE API UPDATE GURU:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Update Guru Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Update Guru Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Update Guru");
    }
  },

  async deleteGr(payload) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.GURU}/${payload}`
      );
      console.log("RESPONSE API DELETE GURU:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Delete Guru Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Delete Guru Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Delete Guru");
    }
  },
};

export default DataService;
