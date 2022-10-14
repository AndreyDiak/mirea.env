import { useState } from "react";
import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserScreen from "../screens/UserScreen";
import LoginScreen from "../screens/LoginScreen";
import AuthInfoScreen from "../screens/AuthInfoScreen";
import AuthBioScreen from "../screens/AuthBioScreen";

type Props = {
  isAuth: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = ({ isAuth }: Props) => {
  return !isAuth ? (
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
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
