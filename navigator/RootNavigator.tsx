import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import { useUserData } from "../hooks/useUserData";
import AuthBioScreen from "../screens/AuthBioScreen";
import AuthInfoScreen from "../screens/AuthInfoScreen";
import DisciplineScreen from "../screens/DisciplineScreen";
import LoginScreen from "../screens/LoginScreen";
import TabNavigator from "./TabNavigator";

type Props = {
  user: any
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = ({ user }: Props) => {
  const dispatch = useDispatch();
  const initialUser = useUserData(user?.email)

  useEffect(() => {
    dispatch(setUser(initialUser));
  }, [user])

  return !user ? (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: "modal",
          }}
          name="AuthInfo"
          component={AuthInfoScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: "modal",
          }}
          name="AuthBio"
          component={AuthBioScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
          component={TabNavigator}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Discipline" component={DisciplineScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
