import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import DisciplinesScreen from "../screens/DisciplinesScreen";
import ProfileScreen from "../screens/ProfileScreen";
const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={ ({ route }) => ({
      tabBarActiveTintColor: '#60a5fa',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarIcon: ({ focused }) => {
        if (route.name === 'Profile') {
          return (
            <Icon 
              name="home"
              type="material"
              color={focused ? '#60a5fa' : '#9ca3af'}
              size={30}
            />
          )
        } else if(route.name === 'Disciplines') {
          return (
            <Icon 
              name="format-list-numbered"
              type="material"
              color={focused ? '#60a5fa' : '#9ca3af'}
              size={30}
              />
          )
        }
      }
    })}>
      <Tab.Screen
        name="Disciplines"
        options={{ headerShown: false }}
        component={DisciplinesScreen}
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
