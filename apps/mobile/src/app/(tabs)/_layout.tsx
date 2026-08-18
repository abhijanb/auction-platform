import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#4F46E5" }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="auction"
                options={{
                    title: "Auction",
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="tag" color={color} />,
                }}
            />
        </Tabs>
    );
}