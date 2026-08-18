import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <Provider store={store}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="register" />
                    <Stack.Screen name="login" />
                </Stack>
            </ThemeProvider>
        </Provider>
    );
}