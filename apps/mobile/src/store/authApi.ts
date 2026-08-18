import { baseApi } from "./baseApi";

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

export const authApi = baseApi.injectEndpoints({
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