import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Redirect } from "expo-router";
import type { RootState } from "@/store/store";
import { BADGE_COLORS, SECTION_ORDER, SECTION_TITLE } from "@/lib/constants";
import ProductCard from "@/component/ProductCard";
import {
    productStatus,
    useGetProductsQuery,
} from "@/store/productsApi";



export default function HomeScreen() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { data: products, isLoading, error } = useGetProductsQuery(undefined, {
        skip: !isAuthenticated,
    });

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
                <Text style={styles.title}>Dashboard</Text>
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