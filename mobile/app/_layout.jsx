import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { SafeAreaView, StatusBar } from "react-native";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;
    if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
    try {
      if (!isSignedIn && !inAuthScreen) {
        router.replace("/(auth)");
      }
    } catch (error) {}
  }, [user, token, segments]);
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
      <StatusBar
        hidden={false}
        backgroundColor={COLORS.background}
        barStyle="dark-content"
      />
    </SafeAreaProvider>
  );
}
