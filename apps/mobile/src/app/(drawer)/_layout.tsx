import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
    return (
        <Drawer>
            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: "Dashboard",
                    title: "Dashboard",
                }}
            />
            <Drawer.Screen
                name="auction"
                options={{
                    drawerLabel: "Auction",
                    title: "Auction",
                }}
            />
        </Drawer>
    );
}