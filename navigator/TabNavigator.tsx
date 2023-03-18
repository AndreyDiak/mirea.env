import React from "react";

import { Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";

import { selectUser } from "../features/userSlice";
import { DisciplinesScreen, FavoritesScreen, ProfileScreen, TimeTableScreen } from "../screens";
import { TabStackParamList } from "../typings";
import { COLORS_400, COLORS_COMMON } from "../utils";
import { returnAppThemeSecondary, returnHexCode } from "../utils/returnHexCodes";

const Tab = createBottomTabNavigator<TabStackParamList>();

function TabNavigator() {
   const user = useSelector(selectUser);

   const activeColor = returnHexCode(user.theme);

   const disabledColor = COLORS_COMMON.DISABLED;

   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            headerTintColor: "red",
            tabBarInactiveBackgroundColor: returnAppThemeSecondary(user.appTheme),
            tabBarActiveBackgroundColor: returnAppThemeSecondary(user.appTheme),
            tabBarActiveTintColor: COLORS_400.BLUE,
            tabBarInactiveTintColor: disabledColor,
            // eslint-disable-next-line react/no-unstable-nested-components, consistent-return
            tabBarLabel: ({ focused }) => {
               if (route.name === "Profile") {
                  return (
                     <Text
                        style={{
                           color: focused ? activeColor : disabledColor,
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
                           color: focused ? activeColor : disabledColor,
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
                           color: focused ? activeColor : disabledColor,
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
                           color: focused ? activeColor : disabledColor,
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
                        color={focused ? activeColor : disabledColor}
                        size={30}
                     />
                  );
               }
               if (route.name === "Disciplines") {
                  return (
                     <Icon
                        name="school"
                        type="material"
                        color={focused ? activeColor : disabledColor}
                        size={30}
                     />
                  );
               }
               if (route.name === "Timetable") {
                  return (
                     <Icon
                        name="today"
                        type="material"
                        color={focused ? activeColor : disabledColor}
                        size={30}
                     />
                  );
               }
               if (route.name === "Favorites") {
                  return (
                     <Icon
                        name="save"
                        type="material"
                        color={focused ? activeColor : disabledColor}
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
         <Tab.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
      </Tab.Navigator>
   );
}

export default TabNavigator;
