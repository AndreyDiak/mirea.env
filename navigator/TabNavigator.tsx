import React from "react";

import { Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";

import { selectUser } from "../features/userSlice";
import { DisciplinesScreen, FavoritesScreen, ProfileScreen, TimeTableScreen } from "../screens";
import { TabStackParamList } from "../typings";
import { returnHexCode, returnLightenAppTheme } from "../utils/returnHexCodes";

const Tab = createBottomTabNavigator<TabStackParamList>();

function TabNavigator() {
   const user = useSelector(selectUser);

   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            headerTintColor: "red",
            tabBarInactiveBackgroundColor: returnLightenAppTheme(user.appTheme),
            tabBarActiveBackgroundColor: returnLightenAppTheme(user.appTheme),
            tabBarActiveTintColor: "#60a5fa",
            tabBarInactiveTintColor: "#9ca3af",
            // eslint-disable-next-line react/no-unstable-nested-components, consistent-return
            tabBarLabel: ({ focused }) => {
               if (route.name === "Profile") {
                  return (
                     <Text
                        style={{
                           color: focused ? returnHexCode(user.theme) : "#9ca3af",
                           fontSize: 10,
                        }}
                     >
                        Профиль
                     </Text>
                  );
               }
               if (route.name === "Disciplines") {
                  return (
                     <Text
                        style={{
                           color: focused ? returnHexCode(user.theme) : "#9ca3af",
                           fontSize: 10,
                        }}
                     >
                        Дисциплины
                     </Text>
                  );
               }
               if (route.name === "Timetable") {
                  return (
                     <Text
                        style={{
                           color: focused ? returnHexCode(user.theme) : "#9ca3af",
                           fontSize: 10,
                        }}
                     >
                        Расписание
                     </Text>
                  );
               }
               if (route.name === "Favorites") {
                  return (
                     <Text
                        style={{
                           color: focused ? returnHexCode(user.theme) : "#9ca3af",
                           fontSize: 10,
                        }}
                     >
                        Избранное
                     </Text>
                  );
               }
            },
            // eslint-disable-next-line react/no-unstable-nested-components, consistent-return
            tabBarIcon: ({ focused }) => {
               if (route.name === "Profile") {
                  return (
                     <Icon
                        name="home"
                        type="material"
                        color={focused ? returnHexCode(user.theme) : "#9ca3af"}
                        size={30}
                     />
                  );
               }
               if (route.name === "Disciplines") {
                  return (
                     <Icon
                        name="school"
                        type="material"
                        color={focused ? returnHexCode(user.theme) : "#9ca3af"}
                        size={30}
                     />
                  );
               }
               if (route.name === "Timetable") {
                  return (
                     <Icon
                        name="today"
                        type="material"
                        color={focused ? returnHexCode(user.theme) : "#9ca3af"}
                        size={30}
                     />
                  );
               }
               if (route.name === "Favorites") {
                  return (
                     <Icon
                        name="save"
                        type="material"
                        color={focused ? returnHexCode(user.theme) : "#9ca3af"}
                        size={30}
                     />
                  );
               }
            },
         })}
      >
         <Tab.Screen name="Disciplines" options={{ headerShown: false }} component={DisciplinesScreen} />
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
}

export default TabNavigator;
