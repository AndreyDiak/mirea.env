import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotifications, setUser } from "../features/userSlice";
import { auth, db } from "../firebase";

import {
  AdminScreen,
  AuthBioScreen,
  AuthInfoScreen,
  LoginScreen,
  ChatsScreen,
  ChatScreen,
  CommentsScreen,
  DisciplineScreen,
} from "../screens";

import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // user которого мы получаем от сервиса авторизации...
  const [initialUser, setInitialUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType>();
  const dispatch = useDispatch();

  // авторизация с сервиса...
  onAuthStateChanged(auth, async (resolve) => {
    if (resolve) {
      setInitialUser(resolve);
    } else {
      setInitialUser(null);
    }
  });

  //на основе данных с сервиса получаем данные с БД
  useEffect(() => {
    const getUser = async () => {
      if (initialUser) {
        const q = query(
          collection(db, "users"),
          where("email", "==", initialUser.email)
        );
        const querySnap = await getDocs(q);
        // Teacher | Student type...
        const user: any = {
          ...querySnap.docs[0].data(),
          userId: querySnap.docs[0].id,
        };
        dispatch(setUser(user));
        setUserType(user.type);
      } else {
        dispatch(setUser(null));
        dispatch(setNotifications([]));
      }
    };
    getUser();
  }, [initialUser]);

  console.log("userType: " + userType);

  return !initialUser ? (
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
  ) : userType === "admin" ? (
    <AdminScreen />
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
        <Stack.Screen name="Comments" component={CommentsScreen} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
