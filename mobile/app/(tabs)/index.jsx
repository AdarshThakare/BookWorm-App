import { View, Text } from "react-native";
import React from "react";
import { Button } from "@react-navigation/elements";
import { useAuthStore } from "@/store/authStore";

const Home = () => {
  const { logout } = useAuthStore();
  return (
    <View>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};

export default Home;
