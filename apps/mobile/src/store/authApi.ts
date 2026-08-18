import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export interface AuthInput {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
    };
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, AuthInput>({
            query: (body) => ({ url: "/login", method: "POST", body }),
        }),
        register: builder.mutation<MessageResponse, AuthInput>({
            query: (body) => ({ url: "/register", method: "POST", body }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
