import { create } from "zustand";
import axios from "axios";

// const API_URL =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:5000/api/auth"
//     : "/api/auth";
const API_URL = "https://readspeakapp.azurewebsites.net";
axios.defaults.withCredentials = true;
export const authStore = create((set) => {
  const handleObject = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signup: async (user) => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(`${API_URL}/signup`, user);
        set({
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Error in Sign up",
        });
        throw error;
      }
    },
    verifyUser: async (code) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/verify-user`, { code });
        set({ isLoading: false, user: response.data.user });
      } catch (error) {
        console.log(error);
        set({
          isLoading: false,
          error: error.response?.data?.message || "Error in Verifying User",
        });
        throw error;
      }
    },

    login: async (user) => {
      set({ isLoading: true });
      try {
        const response = await axios.post(`${API_URL}/login`, user);
        set({
          isLoading: false,
          user: response.data.user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.log(error);
        set({
          isLoading: false,
          error: error.response?.data?.message || "Error in Loggging the user",
        });
        throw error;
      }
    },
    checkAuth: async () => {
      set({ isCheckingAuth: true, error: null });
      try {
        const response = await axios.get(`${API_URL}/check-auth`);
        set({
          user: response.data.user,
          isCheckingAuth: false,
          isAuthenticated: true,
        });
        return response.data.user;
      } catch (error) {
        console.log("checking Auth");
        set({
          isCheckingAuth: false,
          error: null,
        });
      }
    },
    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(`${API_URL}/logout`);
        set({ isLoading: false, isAuthenticated: false, user: null });
      } catch (error) {
        console.log(error);
        set({
          isLoading: false,
          error: error.response?.data?.message || "Error while logout",
        });
        throw error;
      }
    },
    forgotPassword: async (email) => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(`${API_URL}/forgot-password`, { email });
        set({ isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Error in forgotting message",
        });
        throw error;
      }
    },
    resetPassword: async (token, password) => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(`${API_URL}/reset-password/${token}`, { password });
        set({ isLoading: false, error: null });
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Error in reseting password",
        });
        throw error;
      }
    },
  };

  return handleObject;
});
