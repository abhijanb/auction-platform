import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello, world!</Text>
            <Pressable onPress={() => router.push("/register")} style={styles.link}>
                <Text style={styles.linkText}>Create an account</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        gap: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: "600",
        color: "#000",
    },
    link: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    linkText: {
        color: "#4F46E5",
        fontSize: 16,
        fontWeight: "500",
    },
});
