import { Image, StyleSheet, Text, View } from "react-native";
import { BADGE_COLORS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { ENV } from "@/lib/env";
import { productStatus, type Product } from "@/store/productsApi";

export default function ProductCard({ product }: { product: Product }) {
    const status = productStatus(product);
    const badge = BADGE_COLORS[status];
    return (
        <View style={styles.card}>
            <Image source={{ uri: `${ENV.API_URL}${product.image}` }} style={styles.image} />
            <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.badgeText, { color: badge.text }]}>{status}</Text>
                    </View>
                </View>
                <Text style={styles.price}>
                    {product.startingPrice !== null ? `NPR ${product.startingPrice}` : "Starting price TBA"}
                </Text>
                <Text style={styles.time}>
                    Starts {formatDateTime(product.auctionStartsAt)} · Ends {formatDateTime(product.auctionEndsAt)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        overflow: "hidden",
    },
    image: {
        width: 88,
        height: 88,
        backgroundColor: "#F3F4F6",
    },
    cardBody: {
        flex: 1,
        padding: 12,
        gap: 4,
        justifyContent: "center",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    productName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    badge: {
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
    },
    price: {
        fontSize: 15,
        fontWeight: "600",
        color: "#4F46E5",
    },
    time: {
        fontSize: 12,
        color: "#6B7280",
    },
});
