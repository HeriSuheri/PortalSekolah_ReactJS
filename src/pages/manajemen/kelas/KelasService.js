import { apiClient, handleError } from "../../../service/BaseApi";

const API_ENDPOINTS = {
  KELAS: process.env.REACT_APP_KELAS,
  ALL_GURU: process.env.REACT_APP_ALL_GURU,
  SISWA: process.env.REACT_APP_SISWA,
  REGISTER_URL: process.env.REACT_APP_REGISTER_PPDB,
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
    const { id, name, gradeLevelId, waliGuruId, isActive } = payload;
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.KELAS}/${id}`, {
        name,
        gradeLevelId,
        waliGuruId,
        isActive,
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
        `${API_ENDPOINTS.KELAS}/${payload}`,
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
        },
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

  async getJumlahSiswa(id) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.KELAS}/${id}/kelasDetail`,
      );
      console.log("RESPONSE API GET DETAIL SISWA KELAS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get siswa kelas Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get siswa kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get siswa kelas");
    }
  },

  async searchSiswa({ id = null, page = 0, size = 10, keyword = "" } = {}) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.KELAS}/${id}/detail/search`,
        {
          params: { page, size, keyword },
        },
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
        message: response.data.message || "Get detail kelas Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get detail kelas");
    }
  },

  async createSiswa(form) {
    const payload = {
      noPendaftaran: form?.noPendaftaran,
      nama: form.nama,
      tanggalLahir: form.tanggalLahir,
      email: form.email,
      namaAyah: form.namaAyah,
      namaIbu: form.namaIbu,
      alamat: form.alamat,
      noHandphone: form.noHandphone,
      jumlahBayar: form?.jumlahDibayar,
      statusPembayaran: form.statusPembayaran,
      status: form.status,
      classroomId: form.classroomId,
    };
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

  async createSiswaPpdb(form) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SISWA, form);
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
        payload,
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
        `${API_ENDPOINTS.SISWA}/${idSiswa}`,
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

  async getSiswaAll() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SISWA}/all`);
      console.log("RESPONSE API SISWA ALL:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get siswa all Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get siswa all Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get siswa all");
    }
  },

  async getSiswaPaging({ page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SISWA, {
        params: { page, size },
      });

      console.log("RESPONSE API GET SISWA:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Siswa Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Siswa");
    }
  },

  async searchDataSiswa({ keyword = "", page = 0, size = 10 } = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SISWA}/search`, {
        params: { keyword, page, size },
      });
      console.log("RESPONSE API CARI SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get search siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get search siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search siswa");
    }
  },

  // arsip berhenti
  async getSiswaPagingBerhenti({ page = 0, size = 10, tahun = "" } = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SISWA}/berhenti`, {
        params: { tahunBerhenti: tahun, page, size },
      });

      console.log("RESPONSE API GET SISWA:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Siswa Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Siswa");
    }
  },

  async searchDataSiswaBerhenti({
    keyword = "",
    page = 0,
    size = 10,
    tahun = "",
  } = {}) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.SISWA}/berhenti/search`,
        {
          params: { keyword, tahunBerhenti: tahun, page, size },
        },
      );
      console.log("RESPONSE API CARI SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get search siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get search siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search siswa");
    }
  },
  // end arsip berhenti

  // arsip lulus
  async getSiswaPagingLulus({ page = 0, size = 10, tahun = "" } = {}) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SISWA}/lulus`, {
        params: { angkatan: tahun, page, size },
      });

      console.log("RESPONSE API GET SISWA:", response);

      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          data: response.data.data, // ini Map<String, Object> dari backend
          message: response.data.message || "Get Siswa Successfully",
        };
      }

      return {
        success: false,
        message: response.data?.message || "Get Siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get Siswa");
    }
  },

  async searchDataSiswaLulus({
    keyword = "",
    page = 0,
    size = 10,
    tahun = "",
  } = {}) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.SISWA}/lulus/search`,
        {
          params: { keyword, angkatan: tahun, page, size },
        },
      );
      console.log("RESPONSE API CARI SISWA:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get search siswa Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get search siswa Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Search siswa");
    }
  },
  // end arsip siswa lulus

  async getClassAll() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.KELAS}/all`);
      console.log("RESPONSE API CLASSRROOM ALL:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get classroom all Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get classroom all Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get classroom all");
    }
  },

  async getDataPpdb() {
    const tahun = new Date().getFullYear();
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.REGISTER_URL}/all?tahun=${tahun}`,
      );
      console.log("RESPONSE API DATA PPDB:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Get data PPDB Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Get data PPDB Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Get data PPDB");
    }
  },

  async postArchive(selected, status, dataAlasan) {
    try {
      let response = null;
      if (status === "BERHENTI") {
        response = await apiClient.post(
          `${API_ENDPOINTS.SISWA}/${selected?.id}/berhenti`,
          { alasan: dataAlasan },
        );
      } else {
        response = await apiClient.post(
          `${API_ENDPOINTS.SISWA}/${selected?.id}/lulus`,
          { alasan: dataAlasan },
        );
      }

      console.log("RESPONSE API KIRIM ARSIP:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Arsip Data Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Arsip Data Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Arsip Data");
    }
  },

  async undoBerhenti(data) {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.SISWA}/berhenti/undo/${data?.id}`,
      );

      console.log("RESPONSE API UNDO BERHENTI:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Undo berhenti Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Undo berhenti Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Undo berhenti");
    }
  },

  async undoLulus(data) {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.SISWA}/lulus/undo/${data?.id}`,
      );

      console.log("RESPONSE API UNDO LULUS:", response);
      if (response.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message || "Undo lulus Succesfully",
        };
      }
      return {
        success: false,
        message: response.data.message || "Undo lulus Failed",
        data: null,
      };
    } catch (error) {
      console.error("ERROR:", error);
      return handleError(error, "Undo lulus");
    }
  },
};

export default DataService;
