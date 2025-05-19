import { Text, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../constants/colors";

const LogoutButton = () => {
    const { logout } = useAuthStore();

    const confimLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => logout(),
            },
        ]);
    };

    return (
        <TouchableOpacity style={styles.logoutButton} onPress={() =>logout()}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    );
};

export default LogoutButton;
