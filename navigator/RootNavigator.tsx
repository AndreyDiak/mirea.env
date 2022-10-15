import { useState } from "react";
import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import AuthInfoScreen from "../screens/AuthInfoScreen";
import AuthBioScreen from "../screens/AuthBioScreen";
import TabNavigator from "./TabNavigator";

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
        <Stack.Screen name='Main' options={{headerShown: false}} component={TabNavigator} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
