import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useBookStore = create((set) => ({
  isLoading: false,

  addBook: async (bookData) => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("token : ", token);
      const response = await fetch(
        `https://bookworm-backend-jlq2.onrender.com/api/v1/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));
