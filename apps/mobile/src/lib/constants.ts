import type { ProductStatus } from "@/store/productsApi";

export const SECTION_ORDER: ProductStatus[] = ["LIVE", "SCHEDULED", "ENDED"];

export const SECTION_TITLE: Record<ProductStatus, string> = {
    LIVE: "Live",
    SCHEDULED: "Scheduled",
    ENDED: "Ended",
};

export const BADGE_COLORS: Record<ProductStatus, { bg: string; text: string }> = {
    LIVE: { bg: "#DCFCE7", text: "#15803D" },
    SCHEDULED: { bg: "#F3F4F6", text: "#374151" },
    ENDED: { bg: "#DBEAFE", text: "#1D4ED8" },
};
