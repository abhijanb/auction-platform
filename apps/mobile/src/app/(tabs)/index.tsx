import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "expo-router";
import type { RootState } from "@/store/store";
import { BADGE_COLORS, SECTION_ORDER, SECTION_TITLE } from "@/lib/constants";
import ProductCard from "@/component/ProductCard";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import {
    productStatus,
    useGetProductsQuery,
} from "@/store/productsApi";



export default function HomeScreen() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { data: products, isLoading, error } = useGetProductsQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        const socket = connectSocket();

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);
        const onError = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onError);

        setConnected(socket.connected);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onError);
            disconnectSocket();
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) return <Redirect href="/login" />;

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

    const sections = SECTION_ORDER.map((status) => ({
        status,
        products: (products ?? []).filter((p) => productStatus(p) === status),
    }));

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.content}
            ListHeaderComponent={
                <View>
                    <View style={[styles.statusPill, connected ? styles.statusPillConnected : styles.statusPillDisconnected]}>
                        <View style={[styles.statusDot, connected ? styles.statusDotConnected : styles.statusDotDisconnected]} />
                        <Text style={[styles.statusText, connected ? styles.statusTextConnected : styles.statusTextDisconnected]}>
                            {connected ? "Connected" : "Not connected"}
                        </Text>
                    </View>
                    <Text style={styles.title}>Dashboard</Text>
                </View>
            }
            data={sections}
            keyExtractor={(section) => section.status}
            renderItem={({ item }) => (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{SECTION_TITLE[item.status]}</Text>
                    {item.products.length === 0 ? (
                        <Text style={styles.empty}>No {SECTION_TITLE[item.status].toLowerCase()} products</Text>
                    ) : (
                        item.products.map((product) => <ProductCard key={product.id} product={product} />)
                    )}
                </View>
            )}
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
        gap: 24,
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
    statusPill: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 8,
    },
    statusPillConnected: {
        backgroundColor: "#DCFCE7",
    },
    statusPillDisconnected: {
        backgroundColor: "#FEE2E2",
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusDotConnected: {
        backgroundColor: "#16A34A",
    },
    statusDotDisconnected: {
        backgroundColor: "#DC2626",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    statusTextConnected: {
        color: "#15803D",
    },
    statusTextDisconnected: {
        color: "#B91C1C",
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    empty: {
        color: "#6B7280",
        fontSize: 14,
    },
    errorText: {
        color: "#DC2626",
        fontSize: 14,
        textAlign: "center",
    },
});