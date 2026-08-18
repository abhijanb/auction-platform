import { format } from "date-fns";

export function formatDateTime(iso: string | null | undefined): string {
    if (!iso) return "—";
    return format(new Date(iso), "MMM d, h:mm a");
}
