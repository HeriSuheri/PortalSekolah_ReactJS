import axios from "axios";
import { handleLogout } from "../util";
import { useAuth } from "../internal/AuthContext";

let toastFunction = null;

// Set toast handler dari komponen (misalnya dari context atau layout)
export const setToastHandler = (handler) => {
  toastFunction = handler;
};

// Env config
const BASE_URL = process.env.REACT_APP_API;
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;
const ENABLE_DEBUG = process.env.REACT_APP_ENABLE_DEBUG_MODE === "true";
const ENABLE_LOGGING = process.env.REACT_APP_ENABLE_API_LOGGING === "true";

// Token parser (JSON-safe)
// const getAuthToken = () => {
//   const user = JSON.parse(localStorage.getItem("userLogin"));
//   let token =
//     sessionStorage.getItem("accessToken") ||
//     sessionStorage.getItem("jsonAccessToken") ||
//     user?.token

//   if (token && token.startsWith("{")) {
//     try {
//       const parsed = JSON.parse(token);
//       token = parsed.access_token || parsed.accessToken || token;
//     } catch (e) {
//       if (ENABLE_DEBUG) console.warn("Token JSON parse failed:", e);
//     }
//   }

//   return token;
// };

const getAuthToken = () => {
  let token = null;

  // Ambil dari sessionStorage dulu
  token =
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("jsonAccessToken");

  // Kalau belum ada, ambil dari localStorage
  if (!token) {
    try {
      const rawUser = localStorage.getItem("userLogin");
      const user = JSON.parse(rawUser) || {};
      token = user?.token || null;
    } catch (e) {
      if (ENABLE_DEBUG) console.warn("Gagal parse userLogin:", e);
    }
  }

  // Kalau token berbentuk JSON string, parse lagi
  if (token && token.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(token);
      token = parsed.access_token || parsed.accessToken || token;
    } catch (e) {
      if (ENABLE_DEBUG) console.warn("Token JSON parse failed:", e);
    }
  }

  return token;
};

// Custom headers from localStorage
const getCustomHeaders = () => ({
  "Maindealer-ID": localStorage.getItem("Maindealer-ID") || "",
  "Category-ID": localStorage.getItem("Category-ID") || "",
  "Company-ID": localStorage.getItem("Company-ID") || "",
  "Site-ID": localStorage.getItem("Site-ID") || "",
});

// Toast error helper
const showErrorToast = (title, message) => {
  if (toastFunction) {
    toastFunction("error", title, message || "Terjadi kesalahan");
  }
};

// Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers = {
      ...config.headers,
      ...getCustomHeaders(),
    };

    if (ENABLE_LOGGING && ENABLE_DEBUG) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    showErrorToast("Request Error", error.message);
    return Promise.reject(wrapError(error));
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (ENABLE_LOGGING && ENABLE_DEBUG) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          message: response.data?.message,
        }
      );
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (!error.response) {
      console.error("Network error:", error.request || error);
      showErrorToast("Network Error");
    }
    // else if (status === 401) {
    //   // localStorage.removeItem("accessToken");
    //   // window.location.href = "/";
    //   // handleLogout();
    //   const { logout } = useAuth(); // ⬅ ambil dari context
    //   logout();
    // }
    else {
      const res = error.response?.data;
      const msg = res?.message || res?.error || "Terjadi kesalahan";

      console.error(`[${status}] ${error.config?.url}`);
      showErrorToast(`Error ${status}`, msg);
    }

    return Promise.reject(wrapError(error));
  }
);

// Error wrapper
const wrapError = (error) => {
  const wrapped = new Error(error.message || "Unknown error");
  wrapped.name = "AxiosError";
  wrapped.response = error.response;
  wrapped.request = error.request;
  wrapped.config = error.config;
  return wrapped;
};

// Optional structured error handler
// const handleError = (error, context = "Operasi") => {
//   let message = `Gagal melakukan ${context}`;

//   const res = error.response?.data;

//   if (error.response?.status === 401) {
//     message = "Autentikasi diperlukan. Silakan login.";
//   } else if (error.response?.status === 403) {
//     message = "Akses ditolak. Tidak punya izin.";
//   } else if (error.response?.status === 404) {
//     message = "Data tidak ditemukan.";
//   } else if (res?.message) {
//     message = res.message;
//   } else if (res?.error) {
//     message = res.error;
//   } else if (typeof res === "string") {
//     message = res;
//   }

//   return {
//     success: false,
//     message,
//     data: null,
//   };
// };

const handleError = (error, context = "Operasi") => {
  const status = error.response?.status;
  const res = error.response?.data || {};
  const backendMessage = res.message || res.error;

  // Gunakan pesan dari backend jika tersedia
  if (backendMessage) {
    return {
      success: false,
      message: backendMessage,
      data: null,
    };
  }

  // Fallback berdasarkan status HTTP
  let message = `Gagal melakukan ${context}`;
  switch (status) {
    case 401:
      message = "Autentikasi diperlukan. Silakan login.";
      break;
    case 403:
      message = "Akses ditolak. Anda tidak memiliki izin.";
      break;
    case 404:
      message = "Data tidak ditemukan.";
      break;
    case 500:
      message = "Terjadi kesalahan pada server.";
      break;
    default:
      message = `Gagal melakukan ${context}.`;
  }

  return {
    success: false,
    message,
    data: null,
  };
};
export { apiClient, handleError };
