import { useState } from "react";
import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import UserScreen from "../screens/UserScreen";

type Props = {
  isAuth: boolean
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = ({isAuth} : Props) => {

  return !isAuth ? (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Auth"
          component={AuthScreen}
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
