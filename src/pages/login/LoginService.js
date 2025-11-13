import { apiClient, handleError } from "../../service/BaseApi";

const API_ENDPOINTS = {
  LOGIN: process.env.REACT_APP_LOGIN,
  CHANGE_PASSWORD: process.env.REACT_APP_CHANGE_PASSWORD,
  ROLE: process.env.REACT_APP_ROLE,
  UPLOAD_FOTO: process.env.REACT_APP_UPLOAD_FOTO,
};

const DataService = {
  async Login(payload) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, payload);
      console.log("RESPONSE API LOGIN:", response);

      // const { success, status, message, data } = response.data;

      // return {
      //   success: success === true && status === 200,
      //   message: message || (success ? "Login berhasil" : "Login gagal"),
      //   data: success ? data : null,
      // };
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Login Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Login Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Login");
    }
  },

  async ChangePassword(payload) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CHANGE_PASSWORD,
        payload
      );
      console.log("RESPONSE API CHANGE PASSWORD:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Change Passwoerd Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Change Password Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Change Password");
    }
  },

  async getRole() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ROLE);
      console.log("RESPONSE API GET ROLE:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get Role Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get Role Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Role");
    }
  },

  async uploadFoto(file, nomorInduk) {
    console.log("FILE UPLOAD :", file);
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.UPLOAD_FOTO}/${nomorInduk}`,
        file,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("RESPONSE API UPLOAD FOTO:", response);

      if (response?.status === 200) {
        return {
          success: true,
          message: response.data.message || "Data upload successfully",
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to upload data",
        data: null,
      };
    } catch (error) {
      return handleError(error, "upload data");
    }
  },
};

export default DataService;
