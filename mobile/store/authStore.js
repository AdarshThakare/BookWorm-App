import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (email, username, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        "https://bookworm-backend-jlq2.onrender.com/api/v1/auth/register",
        {
          email,
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);

      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      await AsyncStorage.setItem("token", response.data.token);

      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.log("Internal Server Error:", error.message);
      return { success: false };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJSON = await AsyncStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;

      set({ token, user });
    } catch (error) {
      console.error("Auth check failed :", error);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        "https://bookworm-backend-jlq2.onrender.com/api/v1/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);

      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      await AsyncStorage.setItem("token", response.data.token);

      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred during login"
      );
      return { success: false };
    }
  },
}));
