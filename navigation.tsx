import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
//screens
import Buscar from "./screens/Buscar";
import Registrar from "./screens/Registrar";

const Tab = createBottomTabNavigator();
function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Registrar"
            screenOptions={{
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
                headerStyle: {
                    backgroundColor: "#ff0000ff", 
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "600",
                },
            }}
        >
            
            <Tab.Screen 
            name="Registrar" 
            component={Registrar} 
            options={
                {
                    tabBarLabel: 'Registrar Producto',
                    tabBarIcon:({ color, size})=> (
                        <MaterialCommunityIcons name="camera-plus" color={color} size={size} />
                    ),
                    headerTitle: "Registrar Producto",
                    //headerShown: false,


                }
            }
            />
            <Tab.Screen 
            name="Buscar" 
            component={Buscar}
            options={
                {
                    tabBarLabel: 'Buscar Producto',
                    tabBarIcon:({ color, size})=> (
                        <MaterialCommunityIcons name="barcode-scan" color={color} size={size} />

                    ),
                    headerTitle: "Buscar Producto",
                    //headerShown: false,

                }
            }
             />
            
        </Tab.Navigator>
    );
}
export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}