import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { getNotifications, getUser } from "../features/userSlice";
import DisciplinesScreen from "../screens/DisciplinesScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TimeTableScreen from "../screens/TimeTableScreen";
import { returnHexCode } from "../utils/returnHexCode";
const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const notifications = useSelector(getNotifications);
  const user = useSelector(getUser);
  const tw = useTailwind();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabel: ({ focused }) => {
          if (route.name === "Profile") {
            return (
              <Text style={tw(`text-[10px] ${focused ? `text-${user?.theme}-400` : 'text-[#9ca3af]'}`)}>Профиль</Text>
            );
          } else if (route.name === "Disciplines") {
            return (
              <Text style={tw(`text-[10px] ${focused ? `text-${user?.theme}-400` : 'text-[#9ca3af]'}`)}>Дисциплины</Text>
            );
          } else if (route.name === "Timetable") {
            return (
              <Text style={tw(`text-[10px] ${focused ? `text-${user?.theme}-400` : 'text-[#9ca3af]'}`)}>Расписание</Text>
            );
          } else if (route.name === "Notifications") {
            return (
              <Text style={tw(`text-[10px] ${focused ? `text-${user?.theme}-400` : 'text-[#9ca3af]'}`)}>Уведомления</Text>
            );
          }
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "Profile") {
            return (
              <Icon
                name="home"
                type="material"
                color={
                  focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"
                }
                size={30}
              />
            );
          } else if (route.name === "Disciplines") {
            return (
              <Icon
                name="school"
                type="material"
                color={
                  focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"
                }
                size={30}
              />
            );
          } else if (route.name === "Timetable") {
            return (
              <Icon
                name="today"
                type="material"
                color={
                  focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"
                }
                size={30}
              />
            );
          } else if (route.name === "Notifications") {
            return (
              <Icon
                name="notifications"
                type="material"
                color={
                  focused ? returnHexCode(user?.theme as AppTheme) : "#9ca3af"
                }
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
      <Tab.Screen
        name="Timetable"
        options={{ headerShown: false }}
        component={TimeTableScreen}
      />
      {notifications.length ? (
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
      )}
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
