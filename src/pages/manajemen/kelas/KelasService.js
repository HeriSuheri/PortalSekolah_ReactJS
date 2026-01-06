import { apiClient, handleError } from "../../../service/BaseApi";

const API_ENDPOINTS = {
  KELAS: process.env.REACT_APP_KELAS,
  ALL_GURU: process.env.REACT_APP_ALL_GURU,
  SISWA: process.env.REACT_APP_SISWA,
};

const DataService = {
  async getKelas({ page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.KELAS, {
        params: { page, size },
      });

      console.log("RESPONSE API GET KELAS:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Kelas Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Kelas");
    }
  },

  async searchKelas({ page = 0, size = 10, keyword = "" } = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.KELAS}/search`, {
        params: { page, size, keyword },
      });

      console.log("RESPONSE API SEARCH KELAS:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Search Kelas Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Search Kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search Kelas");
    }
  },

  async createKelas(payload) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.KELAS, payload);
      console.log("RESPONSE API CREATE KELAS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Create Kelas Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Create Kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Create Kelas");
    }
  },

  async updateKelas(payload) {
    const { id, name, gradeLevelId, waliGuruId } = payload;
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.KELAS}/${id}`, {
        name,
        gradeLevelId,
        waliGuruId,
      });
      console.log("RESPONSE API UPDATE KELAS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Update Kelas Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Update Kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Update Kelas");
    }
  },

  async deleteKls(payload) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.KELAS}/${payload}`
      );
      console.log("RESPONSE API DELETE KELAS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Delete Kelas Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Delete Kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Delete Kelas");
    }
  },

  async getAllGuru() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ALL_GURU);
      console.log("RESPONSE API GET GURU:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get guru Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get guru Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get guru");
    }
  },

  async getKelasDetail({ id = null, page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.KELAS}/${id}/detail`,
        {
          params: { page, size },
        }
      );
      console.log("RESPONSE API DETAIL KELAS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get detail kelas Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get setail kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get detail kelas");
    }
  },

  async searchSiswa({ id = null, page = 0, size = 10, keyword = "" } = {}) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.KELAS}/${id}/detail/search`,
        {
          params: { page, size, keyword },
        }
      );
      console.log("RESPONSE API DETAIL KELAS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get detail kelas Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get setail kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get detail kelas");
    }
  },

  async createSiswa(payload) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SISWA, payload);
      console.log("RESPONSE API CREATE SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Create Siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Create Siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Create Siswa");
    }
  },

  async updateSiswa(payload) {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.SISWA}/${payload.id}`,
        payload
      );
      console.log("RESPONSE API UPDATE SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Update siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Update siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Update siswa");
    }
  },

  async deleteSiswa(idSiswa) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.SISWA}/${idSiswa}`
      );
      console.log("RESPONSE API DELETE SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Delete siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Delete siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Delete siswa");
    }
  },
};

export default DataService;
