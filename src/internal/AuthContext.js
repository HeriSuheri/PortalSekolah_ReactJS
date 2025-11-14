import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [tokenForgot, setTokenForgot] = useState("");

  const isTokenExpired = () => {
    const user = JSON.parse(localStorage.getItem("userLogin"));
    if (!user?.token) return true;

    try {
      const payload = JSON.parse(atob(user?.token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return now > payload.exp;
    } catch (e) {
      return true;
    }
  };

  // const login = (token, role, nomorInduk, nama, tglLahir, fotoProfil) => {
  //   localStorage.setItem("accessToken", token);
  //   localStorage.setItem("role", role);
  //   localStorage.setItem("nomorInduk", nomorInduk);
  //   localStorage.setItem("nama", nama);
  //   localStorage.setItem("tglLahir", tglLahir);
  //   localStorage.setItem("fotoProfil", fotoProfil);
  //   setIsLoggedIn(true);
  //   setIsExpired(false);
  // };

  // const logout = () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("role");
  //   localStorage.removeItem("nomorInduk");
  //   localStorage.removeItem("nama");
  //   localStorage.removeItem("tglLahir");
  //   localStorage.removeItem("fotoProfil");
  //   localStorage.removeItem("loginAwal");
  //   setIsLoggedIn(false);
  // };

  const login = (data) => {
    console.log("Storing user data on login:", data);
    localStorage.setItem("userLogin", data);
    setIsLoggedIn(true);
    setIsExpired(false);
  };

  const logout = () => {
    localStorage.removeItem("userLogin");
    localStorage.removeItem("loginAwal");
    setIsLoggedIn(false);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   setIsLoggedIn(!!token);
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userLogin"));

    if (!user?.token) {
      logout();
    } else {
      try {
        const payload = JSON.parse(atob(user?.token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (now > payload.exp) {
          logout();
          setIsExpired(true); // ⬅️ munculkan popup kalau mau
        } else {
          setIsLoggedIn(true);
        }
      } catch (e) {
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        setIsExpired(true);
      }
    }, 60000); // cek setiap 1 menit

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        isExpired,
        tokenForgot,
        setTokenForgot,
        setIsExpired,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
