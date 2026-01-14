import { apiClient, handleError } from "../../service/BaseApi";

const API_ENDPOINTS = {
  REGISTER_PPDB: process.env.REACT_APP_REGISTER_PPDB,
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
        payload
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
        `${API_ENDPOINTS.REGISTER_PPDB}/${noPendaftaran}`
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
};

export default DataService;
