import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { isLoading, register } = useAuthStore();

  const handleSignup = async () => {
    const result = await register(email, username, password);
    console.log(result);

    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
      return;
    }

    if (password.length < 3) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!result.success) {
      Alert.alert("Error", "Username or email already exists");
    } else {
      setUsername("");
      setEmail("");
      setPassword("");
      router.push("/(auth)");
      Alert.alert("Success", "Account created successfully");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title]}>BookWorm 📚</Text>
          <Text style={styles.subtitle}>Share your favorite reads !</Text>
        </View>
        <View style={styles.formContainer}>
          {/* USERNAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholderTextColor={COLORS.placeholderText}
                placeholder="Enter your username"
                autoCapitalize="true"
                value={username}
                onChangeText={setUsername}
                keybroardAppearance="dark"
                keyboardType="text"
                style={styles.input}
              />
            </View>
          </View>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholderTextColor={COLORS.placeholderText}
                placeholder="Enter your email"
                autoCapitalize="true"
                value={email}
                onChangeText={setEmail}
                keybroardAppearance="dark"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholderTextColor={COLORS.placeholderText}
                placeholder="Enter your password"
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                keybroardAppearance="dark"
                keyboardType="text"
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSignup();
          }}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Signup</Text>
            )}
          </Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
