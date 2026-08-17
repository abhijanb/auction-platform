import { format } from "date-fns";

export function formatDateTime(iso: string): string {
    return format(new Date(iso), "MMM d, yyyy, h:mm a");
}

export function toIso(datetimeLocal: string): string {
    return datetimeLocal + ":00Z";
}

export function toDatetimeLocal(iso: string): string {
    return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}