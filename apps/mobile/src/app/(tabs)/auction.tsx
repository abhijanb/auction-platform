import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "expo-router";
import type { RootState } from "@/store/store";
import { ENV } from "@/lib/env";
import { connectSocket, disconnectSocket, joinAuction, leaveAuction, type BidJoined } from "@/lib/socket";
import { productStatus, useGetProductsQuery } from "@/store/productsApi";

export default function AuctionScreen() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { data: products, isLoading, error } = useGetProductsQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [joined, setJoined] = useState<Record<string, BidJoined>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pending, setPending] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!isAuthenticated) return;
        const socket = connectSocket();

        const onDisconnect = () => {
            setJoined({});
            setErrors({});
            setPending({});
        };

        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("disconnect", onDisconnect);
            disconnectSocket();
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) return <Redirect href="/login" />;

    const liveProducts = (products ?? []).filter((p) => productStatus(p) === "LIVE");

    const handleJoin = async (productId: string) => {
        setPending((prev) => ({ ...prev, [productId]: true }));
        setErrors((prev) => ({ ...prev, [productId]: "" }));
        try {
            const data = await joinAuction(connectSocket(), productId);
            setJoined((prev) => ({ ...prev, [productId]: data }));
        } catch (e) {
            setErrors((prev) => ({ ...prev, [productId]: e instanceof Error ? e.message : "Failed to join" }));
        } finally {
            setPending((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleLeave = async (productId: string) => {
        setPending((prev) => ({ ...prev, [productId]: true }));
        try {
            await leaveAuction(connectSocket(), productId);
            setJoined((prev) => {
                const next = { ...prev };
                delete next[productId];
                return next;
            });
        } catch (e) {
            setErrors((prev) => ({ ...prev, [productId]: e instanceof Error ? e.message : "Failed to leave" }));
        } finally {
            setPending((prev) => ({ ...prev, [productId]: false }));
        }
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    {error && typeof error === "object" && "data" in error
                        ? ((error as { data?: { error?: string } }).data?.error ?? "Failed to load products")
                        : "Failed to load products"}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.content}
            ListHeaderComponent={<Text style={styles.title}>Auction</Text>}
            data={liveProducts}
            keyExtractor={(product) => product.id}
            renderItem={({ item: product }) => {
                const join = joined[product.id];
                const price = join?.currentPrice ?? product.startingPrice ?? 0;
                const isPending = !!pending[product.id];
                return (
                    <View style={styles.card}>
                        <Image source={{ uri: `${ENV.API_URL}${product.image}` }} style={styles.image} />
                        <View style={styles.cardBody}>
                            <Text style={styles.name} numberOfLines={1}>
                                {product.name}
                            </Text>
                            <Text style={styles.price}>NPR {String(price)}</Text>
                            {join ? (
                                <View style={styles.joinedRow}>
                                    <View style={styles.joinedDot} />
                                    <Text style={styles.joinedText}>Joined</Text>
                                </View>
                            ) : (
                                <Text style={styles.notJoinedText}>Not joined</Text>
                            )}
                            {!!errors[product.id] && <Text style={styles.errorText}>{errors[product.id]}</Text>}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    join ? styles.leaveButton : styles.joinButton,
                                    (pressed || isPending) && styles.buttonPressed,
                                ]}
                                onPress={() => (join ? handleLeave(product.id) : handleJoin(product.id))}
                                disabled={isPending}
                            >
                                <Text style={styles.buttonText}>
                                    {isPending ? "..." : join ? "Leave" : "Join"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                );
            }}
            ListEmptyComponent={<Text style={styles.empty}>No live auctions right now</Text>}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    content: {
        padding: 16,
        gap: 12,
    },
    center: {
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
        marginBottom: 8,
    },
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
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    price: {
        fontSize: 15,
        fontWeight: "600",
        color: "#4F46E5",
    },
    joinedRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    joinedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#16A34A",
    },
    joinedText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#15803D",
    },
    notJoinedText: {
        fontSize: 12,
        color: "#6B7280",
    },
    button: {
        alignSelf: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 4,
    },
    joinButton: {
        backgroundColor: "#4F46E5",
    },
    leaveButton: {
        backgroundColor: "#6B7280",
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    errorText: {
        color: "#DC2626",
        fontSize: 13,
    },
    empty: {
        color: "#6B7280",
        fontSize: 14,
        textAlign: "center",
        padding: 24,
    },
});
