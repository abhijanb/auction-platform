import { StyleSheet, Text, View } from "react-native";

export default function AuctionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auction</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
    },
});
