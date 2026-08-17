import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiError, register, registerSchema } from "../lib/api";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit: SubmitHandler<RegisterForm> = async (values) => {
        if (submitting) return;
        setError(null);
        setSuccess(null);
        setSubmitting(true);
        try {
            const result = await register(values);
            setSuccess(result.message);
            reset();
        } catch (err) {
            if (err instanceof ApiError || err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create account</Text>

                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
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
                            {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Password (min 8 characters)"
                                secureTextEntry
                                style={[styles.input, error ? styles.inputError : null]}
                            />
                            {error ? <Text style={styles.fieldError}>{error.message}</Text> : null}
                        </>
                    )}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}
                {success ? <Text style={styles.success}>{success}</Text> : null}

                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={submitting}
                    style={[styles.button, { opacity: submitting ? 0.5 : 1 }]}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Create account</Text>
                    )}
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
    success: {
        color: "#16A34A",
        fontSize: 14,
    },
});