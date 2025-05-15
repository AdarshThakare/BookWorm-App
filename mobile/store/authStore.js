import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        "https://bookworm-backend-jlq2.onrender.com/api/v1/auth/register",
        {
          username,
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
      await AsyncStorage.setItem("token", JSON.stringify(response.data.token));

      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error("Internal Server Error:", error);
      return { success: false };
    }
  },
}));
