import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { loginSchema, loginSchemaType } from "@/lib/api";
import { useLoginMutation } from "@/store/authApi";
import { setCredentials } from "@/store/authSlice";

export default function LoginScreen() {
    const [error, setError] = useState<string | null>(null);
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    const { control, handleSubmit } = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit: SubmitHandler<loginSchemaType> = async (values) => {
        setError(null);
        try {
            const response = await login(values).unwrap();
            dispatch(setCredentials(response));
            router.push("/");
        } catch (err) {
            if (err && typeof err === "object" && "data" in err) {
                const data = (err as { data?: { error?: string } }).data;
                setError(data?.error ?? "Invalid credentials");
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Sign in</Text>

                <Controller
                    control={control}
                    name="username"
                    rules={{ required: "Username is required" }}
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Username"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={[styles.input, error ? styles.inputError : null]}
                            />
                            {error && error.message ? <Text style={styles.fieldError}>{error.message}</Text> : null}
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Password"
                                secureTextEntry
                                style={[styles.input, error ? styles.inputError : null]}
                            />
                            {error && error.message ? <Text style={styles.fieldError}>{error.message}</Text> : null}
                        </>
                    )}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    style={[styles.button, { opacity: isLoading ? 0.5 : 1 }]}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign in</Text>
                    )}
                </Pressable>

                <Pressable onPress={() => router.push("/register")} style={styles.link}>
                    <Text style={styles.linkText}>Need an account? Create one</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#fff",
    },
    card: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: "#000",
    },
    inputError: {
        borderColor: "#DC2626",
    },
    button: {
        backgroundColor: "#4F46E5",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    error: {
        color: "#DC2626",
        fontSize: 14,
    },
    fieldError: {
        color: "#DC2626",
        fontSize: 12,
        marginTop: -6,
    },
    link: {
        alignItems: "center",
        paddingVertical: 8,
    },
    linkText: {
        color: "#4F46E5",
        fontSize: 14,
        fontWeight: "500",
    },
});