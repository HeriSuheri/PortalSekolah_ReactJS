import { apiClient, handleError } from "../../service/BaseApi";

const API_ENDPOINTS = {
  REGISTER_PPDB: process.env.REACT_APP_REGISTER_PPDB,
  SISWA: process.env.REACT_APP_SISWA,
  //   CHANGE_PASSWORD: process.env.REACT_APP_CHANGE_PASSWORD,
  //   ROLE: process.env.REACT_APP_ROLE,
  //   UPLOAD_FOTO: process.env.REACT_APP_UPLOAD_FOTO,
  //   FORGOT_PASSWORD: process.env.REACT_APP_FORGOT_PASSWORD,
  //   RESET_PASSWORD: process.env.REACT_APP_RESET_PASSWORD,
};

const DataService = {
  async registerPPDB(payload) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.REGISTER_PPDB}/register`,
        payload,
      );
      console.log("RESPONSE API REGISTER PPDB:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Register PPDB Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Register PPDB Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Register PPDB");
    }
  },

  async registerPPDBbyAdmin(payload) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.REGISTER_PPDB}/register-by-admin`,
        payload,
      );
      console.log("RESPONSE API REGISTER PPDB:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Register PPDB Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Register PPDB Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Register PPDB");
    }
  },

  async cekRegisterPPDB(noPendaftaran) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.REGISTER_PPDB}/${noPendaftaran}`,
      );
      console.log("RESPONSE API CEK REGISTER PPDB:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Cek Register PPDB Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Cek Register PPDB Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Cek Register PPDB");
    }
  },

  async cekSiswaRegisterPPDB(noPendaftaran) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.REGISTER_PPDB}/${noPendaftaran}`,
      );
      console.log("RESPONSE API CEK REGISTER PPDB:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Cek Register PPDB Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Cek Register PPDB Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Cek Register PPDB");
    }
  },

  async getPpdbPaging({ page = 0, size = 10, tahun = "" } = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REGISTER_PPDB, {
        params: { page, size, tahun },
      });

      console.log("RESPONSE API GET CALON SISWA:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Calon Siswa Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Calon Siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Calon Siswa");
    }
  },

  async searchDataCalonSiswa({
    keyword = "",
    page = 0,
    size = 10,
    tahun = "",
  } = {}) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.REGISTER_PPDB}/search`,
        {
          params: { keyword, page, size, tahun },
        },
      );
      console.log("RESPONSE API CARI CALON SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message:
            response.data.message || "Get search calon siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get search calon siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search calon siswa");
    }
  },

  async updatePpdb(payload, dataRow) {
    console.log("PAYLOAD:", payload);
    console.log("DATAROW", dataRow);
    const dataPayload = {
      ...payload,
      isSendEmail:
        dataRow?.status !== "DITERIMA" && payload?.status === "DITERIMA"
          ? true
          : false,
    };
    console.log("DATA PAYLOAD:", dataPayload);
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.REGISTER_PPDB}/${payload.id}/update-status`,
        dataPayload,
      );
      console.log("RESPONSE API UPDATE CALON SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Update calon siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Update calon siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Update calon siswa");
    }
  },

  async deletePpdb(idSiswa) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.REGISTER_PPDB}/${idSiswa}`,
      );
      console.log("RESPONSE API DELETE CALON SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Delete calon siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Delete calon siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Delete calon siswa");
    }
  },
};

export default DataService;
