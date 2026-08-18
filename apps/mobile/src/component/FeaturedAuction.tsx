import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ENV } from "@/lib/env";
import { productStatus, type Product } from "@/store/productsApi";

function useCountdown(target: string | null | undefined): string | null {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    return useMemo(() => {
        if (!target) return null;
        const end = new Date(target).getTime();
        const diff = Math.max(0, end - now);
        const h = Math.floor(diff / 3_600_000);
        const m = Math.floor((diff % 3_600_000) / 60_000);
        const s = Math.floor((diff % 60_000) / 1000);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }, [target, now]);
}

export default function FeaturedAuction({ product }: { product: Product }) {
    const status = productStatus(product);
    const countdown = useCountdown(product.auctionEndsAt);
    const price = useMemo(() => {
        if (product.startingPrice === null) return "TBA";
        const n = Number(product.startingPrice);
        if (Number.isNaN(n)) return product.startingPrice;
        return `NPR ${n.toLocaleString()}`;
    }, [product.startingPrice]);

    const isLive = status === "LIVE";

    return (
        <View style={styles.card}>
            <View style={styles.imageWrap}>
                <Image source={{ uri: `${ENV.API_URL}${product.image}` }} style={styles.image} />
                {isLive && (
                    <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                )}
            </View>
            <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>
                    {product.name}
                </Text>
                <View style={styles.priceRow}>
                    <View>
                        <Text style={styles.label}>Current Bid</Text>
                        <Text style={styles.price}>{price}</Text>
                    </View>
                    {isLive && countdown && (
                        <View style={styles.biddersPill}>
                            <Text style={styles.biddersText}>6 Bidders</Text>
                        </View>
                    )}
                </View>
                <View style={styles.divider} />
                {isLive && countdown ? (
                    <Text style={styles.countdown}>Ends in {countdown}</Text>
                ) : (
                    <Text style={styles.countdown}>
                        {status === "SCHEDULED" ? "Auction not started yet" : "Auction ended"}
                    </Text>
                )}
                {isLive && (
                    <Pressable
                        style={({ pressed }) => [styles.bidButton, pressed && styles.bidButtonPressed]}
                        onPress={() => {}}
                    >
                        <Text style={styles.bidButtonText}>PLACE QUICK BID: +100k</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f8f9ff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#c6c6cd",
        overflow: "hidden",
    },
    imageWrap: {
        height: 200,
        backgroundColor: "#eff4ff",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    liveBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#ba1a1a",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ffffff",
    },
    liveText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    body: {
        padding: 24,
        gap: 12,
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "700",
        color: "#000000",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 14,
        lineHeight: 20,
        color: "#45464d",
    },
    price: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: "700",
        color: "#000000",
        letterSpacing: -0.02,
    },
    biddersPill: {
        backgroundColor: "#dce9ff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    biddersText: {
        fontSize: 10,
        fontWeight: "500",
        color: "#0b1c30",
    },
    divider: {
        height: 1,
        backgroundColor: "#c6c6cd",
    },
    countdown: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "500",
        letterSpacing: 0.5,
        color: "#ba1a1a",
    },
    bidButton: {
        backgroundColor: "#006c49",
        paddingVertical: 12,
        borderRadius: 2,
        alignItems: "center",
        overflow: "hidden",
    },
    bidButtonPressed: {
        opacity: 0.85,
    },
    bidButtonText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
});
