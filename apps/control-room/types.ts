export interface AuthUser {
    id: string;
    username: string;
    role: "USER" | "ADMIN";
}

export interface Product {
    id: string;
    name: string;
    image: string;
    auctionStartsAt: string;
    createdAt: string;
}

export type View =
    | { name: "list" }
    | { name: "create" }
    | { name: "edit"; id: string };
