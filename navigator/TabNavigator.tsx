import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { getNotifications, getUser } from "../features/userSlice";
import { DisciplinesScreen, FavoritesScreen, ProfileScreen, TimeTableScreen } from "../screens";

import { returnHexCode } from "../utils/returnHexCodes";
const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const user = useSelector(getUser);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabel: ({ focused }) => {
          if (route.name === "Profile") {
            return (
              <Text
                style={{
                  color: focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af",
                  fontSize: 10,
                }}
              >
                Профиль
              </Text>
            );
          } else if (route.name === "Disciplines") {
            return (
              <Text
                style={{
                  color: focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af",
                  fontSize: 10,
                }}
              >
                Дисциплины
              </Text>
            );
          } else if (route.name === "Timetable") {
            return (
              <Text
                style={{
                  color: focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af",
                  fontSize: 10,
                }}
              >
                Расписание
              </Text>
            );
          } else if (route.name === "Favorites") {
            return (
              <Text
                style={{
                  color: focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af",
                  fontSize: 10,
                }}
              >
                Избранное
              </Text>
            );
          }
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "Profile") {
            return (
              <Icon
                name="home"
                type="material"
                color={focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"}
                size={30}
              />
            );
          } else if (route.name === "Disciplines") {
            return (
              <Icon
                name="school"
                type="material"
                color={focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"}
                size={30}
              />
            );
          } else if (route.name === "Timetable") {
            return (
              <Icon
                name="today"
                type="material"
                color={focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"}
                size={30}
              />
            );
          } else if (route.name === "Favorites") {
            return (
              <Icon
                name="save"
                type="material"
                color={focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"}
                size={30}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen
        name="Disciplines"
        options={{ headerShown: false }}
        component={DisciplinesScreen}
      />
      <Tab.Screen name="Timetable" options={{ headerShown: false }} component={TimeTableScreen} />
      <Tab.Screen name="Favorites" options={{ headerShown: false }} component={FavoritesScreen} />
      {/* {notifications.length ? (
        <Tab.Screen
          name="Notifications"
          options={{ headerShown: false, tabBarBadge: notifications.length }}
          component={NotificationsScreen}
        />
      ) : (
        <Tab.Screen
          name="Notifications"
          options={{ headerShown: false }}
          component={NotificationsScreen}
        />
      )} */}
      <Tab.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
