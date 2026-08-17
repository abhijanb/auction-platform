import { format } from "date-fns";

export function formatDateTime(iso: string): string {
    return format(new Date(iso), "MMM d, yyyy, h:mm a");
}

export function toIso(datetimeLocal: string): string {
    return new Date(datetimeLocal).toISOString();
}

export function toDatetimeLocal(iso: string): string {
    return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}