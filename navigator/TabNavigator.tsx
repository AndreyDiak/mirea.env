import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import DisciplinesScreen from "../screens/DisciplinesScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TimeTableScreen from "../screens/TimeTableScreen";
const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarIcon: ({ focused }) => {
          if (route.name === "Profile") {
            return (
              <Icon
                name="home"
                type="material"
                color={focused ? "#60a5fa" : "#9ca3af"}
                size={30}
              />
            );
          } else if (route.name === "Disciplines") {
            return (
              <Icon
                name="school"
                type="material"
                color={focused ? "#60a5fa" : "#9ca3af"}
                size={30}
              />
            );
          } else if (route.name === "Timetable") {
            return (
              <Icon
                name="today"
                type="material"
                color={focused ? "#60a5fa" : "#9ca3af"}
                size={30}
              />
            );
          } else if (route.name === "Notifications") {
            return (
              <Icon
                name="notifications"
                type="material"
                color={focused ? "#60a5fa" : "#9ca3af"}
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
      <Tab.Screen
        name="Notifications"
        options={{ headerShown: false, tabBarBadge: 0 }}
        component={NotificationsScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
